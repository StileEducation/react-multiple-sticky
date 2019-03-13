/// <reference types="react" />
import * as React from "react";
export interface Props extends React.Props<StickyElement> {
    identifier?: string;
    style?: React.CSSProperties;
    className?: string;
}
export default class StickyElement extends React.Component<Props, {}> {
    render(): JSX.Element;
}
