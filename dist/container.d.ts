/// <reference types="react" />
import * as React from "react";
export interface Props extends React.Props<StickyContainer> {
    scrollDirection?: "X" | "Y";
    className?: string;
    contentClassName?: string;
    stickyClassName?: string;
    stickyTransitionClassName?: string;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    relative?: boolean;
}
export interface State {
    ref: string;
    top: number;
    left: number;
    height: number;
    width: number;
    scrollLeft: number;
    scrollTop: number;
}
export default class StickyContainer extends React.Component<Props, State> {
    refs: {
        [k: string]: React.ReactInstance;
        container: HTMLDivElement;
    };
    constructor(props: Props);
    render(): JSX.Element;
    refresh(): void;
    resetScroll(): void;
    scrollToLeft(): void;
    scrollToTop(): void;
    currentStickyElementIdentifier(): string;
    private onScrollHandler;
    private stickyHeaderHandler;
    private getContainerTopPosition();
    private getContainerLeftPosition();
    private getCover;
    private getSticky;
    private getChildren;
}
