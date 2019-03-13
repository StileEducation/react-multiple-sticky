/// <reference types="react" />
import * as React from "react";
export interface Props extends React.Props<StickyContainerVirtualized> {
    width: number;
    height: number;
    elementHeight: number;
    stickyElementHeight?: number;
    disableStickyHeader?: boolean;
    className?: string;
    contentClassName?: string;
    stickyClassName?: string;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    overscanRowCount?: number;
    onScroll?: () => void;
}
export interface State {
    width: string;
    index: number;
    top: number;
}
export default class StickyContainerVirtualized extends React.Component<Props, State> {
    refs: {
        [k: string]: React.ReactInstance;
        container: HTMLDivElement;
        list: React.ReactInstance;
    };
    constructor(props: Props);
    render(): JSX.Element;
    refresh(): void;
    private scrollHandler;
    scrollToTop(): void;
    currentStickyElementIdentifier(): string;
    private stickyHeaderHandler;
    private getCover;
    private getSticky;
    private getChildren;
}
