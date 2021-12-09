import { AntdTreeContainerProps } from "../typings/AntdTreeProps";
import { createElement, useCallback, useEffect, useState, Key } from "react";
import { ValueStatus } from "mendix";

import { useDebounceFn, useWhyDidYouUpdate } from "ahooks";

import "./ui/index.scss";
import { TreeContainer } from "./components/TreeContainer";
import { DataNode } from "antd/lib/tree";
import useMxWidget from "./useMxWidget";
import { useMxCache } from "./mx/data";
function updateTreeData(list: DataNode[], key: Key, children: DataNode[]): DataNode[] {
    return list.map(node => {
        if (node.key === key) {
            return {
                ...node,
                children
            };
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children)
            };
        }
        return node;
    });
}
export default function (props: AntdTreeContainerProps) {
    const [checkedKeys, setCheckedKeys] = useState<string[]>();
    const [dirty, setDirty] = useState(true);

    const [treeData, setTreeData] = useState<DataNode[]>([]);

    const [ref, widget] = useMxWidget();

    const [restore, cacheMxobject] = useMxCache();

    const onLoadData = useCallback(
        ({ key: guid, children }: any) =>
            new Promise<void>(resolve => {
                if (children) {
                    resolve();
                    return;
                }

                function handleData(objs: any[]): DataNode[] {
                    return objs
                        ? objs.map<DataNode>(obj => ({
                            title: obj.get(props.title),
                            isLeaf: obj.get(props.isLeaf),
                            key: obj.getGuid()
                        }))
                        : [];
                }

                if (props.datasourceMicroflow) {
                    if (widget) {
                        restore.current(guid);
                        (window as any).mx.data.action({
                            params: {
                                applyto: guid ? "selection" : "none",
                                actionname: props.datasourceMicroflow,
                                guids: guid ? [guid] : []
                            },
                            context: widget.mxcontext,
                            origin: widget.mxform,
                            callback(objs: any[]) {
                                const dataNodes = handleData(objs);
                                if (guid) {
                                    setTreeData(origin => updateTreeData(origin, guid, dataNodes));
                                } else {
                                    setTreeData(dataNodes);
                                }
                                cacheMxobject(objs);
                                resolve();
                            },
                            error(error: Error) {
                                (window as any).mx.ui.error(error.message);
                            }
                        });
                    }
                }
            }),
        [widget, props.datasourceMicroflow, props.isLeaf, props.title, cacheMxobject, restore]
    );

    const onSelect = useCallback(
        (guids: string[] | undefined) => {
            if (widget && props.onSelectMicroflow) {
                restore.current(guids);
                (window as any).mx.data.action({
                    params: {
                        applyto: "selection",
                        actionname: props.onSelectMicroflow,
                        guids
                    },
                    context: widget.mxcontext,
                    origin: widget.mxform,
                    callback(objs: any) {
                        console.log(objs);
                    },
                    error(error: Error) {
                        (window as any).mx.ui.error("error", error.message);
                    }
                });
            }
        },
        [widget, props.onSelectMicroflow]
    );

    const onDrop = useCallback(
        (drag?: DataNode, parent?: DataNode, pos?: DataNode) => {
            if (props.dropNode && props.dropNode.status === ValueStatus.Available) {
                props.dropNode.setValue(drag?.title as string);
            }
            if (props.dropPos && props.dropPos.status === ValueStatus.Available) {
                props.dropPos.setValue(pos?.title as string);
            }
            if (props.dropParent && props.dropParent.status === ValueStatus.Available) {
                props.dropParent.setValue(parent?.title as string);
            }
            if (props.onDrop && props.onDrop.canExecute && !props.onDrop.isExecuting) {
                setDirty(true);
                props.onDrop.execute();
            }
        },
        [props.onDrop, props.dropParent, props.dropPos]
    );

    useEffect(() => {
        if (widget) {
            onLoadData({});
        }
    }, [widget]);

    useEffect(() => {
        if (widget && dirty && props.onDrop && !props.onDrop.isExecuting) {
            setDirty(false);
            onLoadData({});
        }
    }, [widget, props.onDrop, dirty]);

    const { run } = useDebounceFn(
        () => {
            onSelect(checkedKeys);
        },
        {
            wait: 500
        }
    );

    const onChange = useCallback(
        (keys: string[]) => {
            setCheckedKeys(keys);
            run();
        },
        [setCheckedKeys, run]
    );

    useWhyDidYouUpdate("Tree", { ...props, restore, cacheMxobject });

    return (
        <div ref={ref}>
            <TreeContainer
                checkedKeys={checkedKeys}
                onChange={onChange}
                loadData={onLoadData}
                treeData={treeData}
                draggable={props.draggable}
                onDrop={onDrop}
            ></TreeContainer>
        </div>
    );
}
