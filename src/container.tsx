import * as React from "react";
import * as ReactDOM from "react-dom";

import StickyElement from "./element";

export interface Props extends React.Props<StickyContainer> {
    scrollDirection?: "X" | "Y";
    className?: string;
    contentClassName?: string;
    stickyClassName?: string;
    stickyTransitionClassName?: string;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
}

export interface State {
    ref: string;
    top: number;
    left: number;
    height: number;
    width: number;
}

let scheduled = false;

export default class StickyContainer extends React.Component<Props, State> {
    public refs: {
        [k: string]: React.ReactInstance;
        container: HTMLDivElement;
    };

    public constructor(props: Props) {
        super(props);
        this.state = {
            ref: null,
            top: 0,
            left: 0,
            height: 0,
            width: 0,
        };
    }

    public render() {
        const style = Object.assign(
            {},
            {
                [`overflow${this.props.scrollDirection || "Y"}`]: "auto",
                position: "relative",
                zIndex: 100,
            },
            this.props.style,
        );
        const contentStyle = Object.assign(
            {},
            { position: "relative" },
            this.props.contentStyle,
        );
        return (
            <div
                ref="container"
                style={style}
                onScroll={this.onScrollHandler}
                className={this.props.className}
            >
                <div
                    className={this.props.contentClassName}
                    style={contentStyle}
                >
                    {this.getCover()}
                    {this.getSticky()}
                    {this.getChildren()}
                </div>
            </div>
        );
    }

    public refresh() {
        this.onScrollHandler();
    }

    public resetScroll() {
        // in some cases we want want to reset everything (when for example list of items change).
        // this will also trigger onScrollHandler
        if (this.props.scrollDirection === "X") {
            this.scrollToLeft();
        } else {
            this.scrollToTop();
        }
    }

    public scrollToLeft() {
        this.refs.container.scrollLeft = 0;
    }

    public scrollToTop() {
        this.refs.container.scrollTop = 0;
    }

    public currentStickyElementIdentifier() {
        const currentStickyElement = this.refs[this.state.ref] as StickyElement;
        if (!currentStickyElement) {
            return;
        }
        return currentStickyElement.props.identifier;
    }

    private onScrollHandler = () => {
        if (scheduled) {
            return;
        }
        scheduled = true;
        window.requestAnimationFrame(() => {
            this.stickyHeaderHandler();
            scheduled = false;
        });
    };

    private stickyHeaderHandler = () => {
        const container = this.refs.container;
        const state: any = {
            ref: null,
            height: 0,
            width: 0,
        };
        if (this.props.scrollDirection === "X") {
            state.left = null;
            if (container.scrollLeft === 0) {
                this.setState(state);
                return;
            }
        } else {
            state.top = null;
            if (container.scrollTop === 0) {
                this.setState(state);
                return;
            }
        }

        let sticky: HTMLElement = null;
        let node: any = state;

        Object.keys(this.refs)
            .filter(ref => ref.startsWith("sticky_"))
            .forEach(ref => {
                const element = ReactDOM.findDOMNode(
                    this.refs[ref],
                ) as HTMLElement;
                if (this.props.scrollDirection === "X") {
                    const offsetLeft = element.offsetLeft;
                    // Snap to grid of 2px to avoid side effect due to zoom and non-integer pixel values
                    if (container.scrollLeft + 2 >= offsetLeft) {
                        if (node && node.left && node.left >= offsetLeft) {
                            return;
                        }
                        // In case we're scrolling back and reach previous sticky header
                        node = {
                            ref,
                            left: offsetLeft - element.offsetWidth,
                            height: element.getBoundingClientRect().height,
                            width: element.getBoundingClientRect().width,
                        };
                        sticky = element;
                    } else if (sticky) {
                        // In case we're scrolling back
                        if (
                            container.scrollLeft + sticky.offsetWidth >=
                            offsetLeft
                        ) {
                            state.left = offsetLeft - sticky.offsetWidth;
                        }
                    }
                } else {
                    const offsetTop = element.offsetTop;
                    // Snap to grid of 2px to avoid side effect due to zoom and non-integer pixel values
                    if (container.scrollTop + 2 >= offsetTop) {
                        if (node && node.top && node.top >= offsetTop) {
                            return;
                        }
                        // In case we're scrolling back and reach previous sticky header
                        node = {
                            ref,
                            top: offsetTop - element.offsetHeight,
                            height: element.getBoundingClientRect().height,
                            width: element.getBoundingClientRect().width,
                        };
                        sticky = element;
                    } else if (sticky) {
                        // In case we're scrolling back
                        if (
                            container.scrollTop + sticky.offsetHeight >=
                            offsetTop
                        ) {
                            state.top = offsetTop - sticky.offsetHeight;
                        }
                    }
                }
            });
        if (node && node.ref) {
            if (
                this.props.scrollDirection === "X" &&
                node.ref === this.state.ref &&
                state.left === this.state.left
            ) {
                return;
            } else if (
                this.props.scrollDirection !== "X" &&
                node.ref === this.state.ref &&
                state.top === this.state.top
            ) {
                return;
            }
            state.ref = node.ref;
            state.height = node.height;
            state.width = node.width;
        }
        this.setState(state);
    };

    private getContainerTopPosition() {
        return this.refs.container.getBoundingClientRect().top;
    }

    private getContainerLeftPosition() {
        return this.refs.container.getBoundingClientRect().left;
    }

    private getCover = () => {
        if (!this.state.ref) return null;
        const style: React.CSSProperties = {
            width: this.state.width + "px",
            height: this.state.height + "px",
            position: "fixed",
            top: this.getContainerTopPosition(),
            left: this.getContainerLeftPosition(),
            background: "white",
            zIndex: 10,
        };

        if (this.props.scrollDirection === "X") {
            style.display = "inline-block";
        }

        return <div style={style} />;
    };

    private getSticky = () => {
        if (!this.state.ref) return null;
        const inTransition =
            this.props.scrollDirection === "X"
                ? this.state.left !== null
                : this.state.top !== null;
        const sticky = this.refs[this.state.ref] as StickyElement;

        if (!sticky) {
            // In some cases it's possible that the list of items is changed (filtered),
            // but we still hold an index of old item (which will be updated in next loop)
            return null;
        }

        const style: React.CSSProperties = {
            width: this.state.width + "px",
            height: this.state.height + "px",
            position: inTransition ? "absolute" : "fixed",
            zIndex: 20,
        };

        if (this.props.scrollDirection === "X") {
            style.left = inTransition
                ? this.state.left
                : this.getContainerLeftPosition();
            style.display = "inline-block";
        } else {
            style.top = inTransition
                ? this.state.top
                : this.getContainerTopPosition();
        }

        const className = inTransition
            ? this.props.stickyTransitionClassName
            : this.props.stickyClassName;
        return (
            <div className={className} style={style}>
                {React.createElement(
                    StickyElement,
                    Object.assign({}, sticky.props, {
                        style: Object.assign({}, sticky.props.style || {}, {
                            visibility: "visible",
                        }),
                    }),
                )}
            </div>
        );
    };

    private getChildren = () => {
        return React.Children.map(
            this.props.children,
            (child: React.ReactElement<any>, idx: number) => {
                if (child.type === StickyElement) {
                    return React.cloneElement(child, {
                        ref: `sticky_${idx}`,
                        style: {
                            position: "relative",
                            visibility:
                                this.state.ref === `sticky_${idx}`
                                    ? "hidden"
                                    : "visible",
                            zIndex: this.state.ref === `sticky_${idx}` ? 5 : 15,
                            display:
                                this.props.scrollDirection === "X"
                                    ? "inline-block"
                                    : "block",
                        },
                    });
                }
                return child;
            },
        );
    };
}
