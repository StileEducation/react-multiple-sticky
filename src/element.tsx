import * as React from "react";

export interface Props extends React.Props<StickyElement> {
    identifier?: string;
    style?: React.CSSProperties;
    className?: string;
}

export default class StickyElement extends React.Component<Props, {}> {
    public render() {
        return (
            <div style={this.props.style} className={this.props.className}>
                {this.props.children}
            </div>
        );
    }
}

export class StickyElementContainer extends React.Component<
    React.Props<HTMLDivElement>,
    {}
> {
    public render() {
        if (
            !this.props.children ||
            this.props.children[0].type !== StickyElement
        ) {
            throw new Error(
                "First child of a StickyElementContainer must be a StickyElement!",
            );
        }
        return <div {...this.props} />;
    }
}
