// https://ant.design/components/tree-cn/#API

import { useControllableValue, useWhyDidYouUpdate } from "ahooks";
import { ConfigProvider, Empty, Tree } from "antd";
import { DataNode, EventDataNode } from "antd/lib/tree";
import { createElement, Key, ReactElement, useCallback } from "react";
import { NodeDragEventParams } from "rc-tree/lib/contextTypes";

import zhCN from "antd/lib/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";

moment.locale("zh-cn");

export interface TreeNode {
    title: string;
    key: string;
    guid: string;
    children: TreeNode[];
}

export interface TreeContainerProps {
    treeData?: DataNode[];
    loadData?: (treeNode: EventDataNode) => Promise<void>;
    checkedKeys?: string[];
    onChange?: (keys: string[]) => void;
    defaultExpandedKeys?: Key[];
    draggable?: boolean;
    onDrop?: (drag?: DataNode, parent?: DataNode, pos?: DataNode) => void;
}

function getItemByPos(data: DataNode[], pos: string) {
    const posItemList = pos
        .split("-")
        .slice(1)
        .map(d => +d);

    let item: DataNode | undefined;
    posItemList.forEach(posItem => {
        item = data[posItem];
        data = item?.children ?? [];
    });
    return item;
}

export const TreeContainer = (props: TreeContainerProps): ReactElement => {
    const [checkedKeys, setCheckedKeys] = useControllableValue(props, {
        valuePropName: "checkedKeys",
        trigger: "onChange"
    });
    const onDrop = useCallback(
        (
            info: NodeDragEventParams & {
                dragNode: EventDataNode;
                dragNodesKeys: Key[];
                dropPosition: number;
                dropToGap: boolean;
            }
        ) => {
            if (props.treeData) {
                props.onDrop?.(
                    getItemByPos(props.treeData, info.dragNode.pos),
                    info.dropToGap
                        ? getItemByPos(props.treeData, info.node.pos.slice(0, info.node.pos.length - 2))
                        : getItemByPos(props.treeData, info.node.pos),
                    info.dropToGap
                        ? getItemByPos(
                              props.treeData,
                              info.node.pos.slice(0, info.node.pos.length - 1) + info.dropPosition
                          )
                        : getItemByPos(props.treeData, info.node.pos + "-" + info.dropPosition)
                );
            }
        },
        [props.treeData]
    );
    useWhyDidYouUpdate("TreeContainer", { ...props });

    return (
        <ConfigProvider locale={zhCN}>
            {props.treeData && props.treeData.length > 0 ? (
                <Tree
                    onDrop={onDrop}
                    multiple
                    draggable={props.draggable}
                    defaultExpandedKeys={props.defaultExpandedKeys}
                    checkedKeys={checkedKeys}
                    onCheck={(_, info) => {
                        const keys = [];
                        let sortedNodes = info.checkedNodesPositions!.sort((a, b) => a.pos.localeCompare(b.pos));
                        while (sortedNodes.length > 0) {
                            const item = sortedNodes[0];
                            // @ts-ignore
                            keys.push(item.node.key);
                            sortedNodes = sortedNodes.filter(d => !d.pos.startsWith(item.pos));
                        }
                        setCheckedKeys(keys);
                    }}
                    checkable
                    loadData={props.loadData}
                    treeData={props.treeData}
                />
            ) : (
                <Empty></Empty>
            )}
        </ConfigProvider>
    );
};
