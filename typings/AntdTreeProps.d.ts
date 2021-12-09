/**
 * This file was generated from AntdTree.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";

export interface AntdTreeContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    datasourceMicroflow: string;
    isLeaf: string;
    title: string;
    onSelectMicroflow: string;
    dropNode?: EditableValue<string>;
    dropParent?: EditableValue<string>;
    dropPos?: EditableValue<string>;
    draggable: boolean;
    onDrop?: ActionValue;
}

export interface AntdTreePreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    datasourceMicroflow: string;
    isLeaf: string;
    title: string;
    onSelectMicroflow: string;
    dropNode: string;
    dropParent: string;
    dropPos: string;
    draggable: boolean;
    onDrop: {} | null;
}
