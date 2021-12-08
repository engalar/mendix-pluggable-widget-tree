import { parseStyle } from "./piw-utils-internal";
import { createElement } from "react";
import { AntdTreePreviewProps } from "../typings/AntdTreeProps";

declare function require(name: string): string;

export function preview(props: AntdTreePreviewProps) {
    return <div style={parseStyle(props.style)}></div>;
}

export function getPreviewCss(): string {
    return require("./ui/index.scss");
}

