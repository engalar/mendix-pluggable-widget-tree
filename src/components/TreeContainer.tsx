import { useControllableValue, useWhyDidYouUpdate } from "ahooks";
import { ConfigProvider, Empty, Tree } from "antd";
import { DataNode, EventDataNode } from "antd/lib/tree";
import { createElement, Key, ReactElement } from "react";

import zhCN from 'antd/lib/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

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
}

export const TreeContainer = (props: TreeContainerProps): ReactElement => {
    const [checkedKeys, setCheckedKeys] = useControllableValue(props, {
        valuePropName: "checkedKeys",
        trigger: "onChange"
    });
    useWhyDidYouUpdate("TreeContainer", { ...props });

    return (
        <ConfigProvider locale={zhCN}>{
            props.treeData && props.treeData.length > 0 ? <Tree
                defaultExpandedKeys={props.defaultExpandedKeys}
                checkedKeys={checkedKeys}
                onCheck={(_, info) => {
                    const keys = [];
                    let sortedNodes = info.checkedNodesPositions!.sort((a, b) => a.pos.localeCompare(b.pos));
                    while (sortedNodes.length > 0) {
                        const item = sortedNodes[0];
                        //@ts-ignore
                        keys.push(item.node.key);
                        sortedNodes = sortedNodes.filter(d => !d.pos.startsWith(item.pos));
                    }
                    setCheckedKeys(keys);
                }}
                checkable
                loadData={props.loadData}
                treeData={props.treeData}
            /> : <Empty></Empty>
        }
        </ConfigProvider>
    );
};
