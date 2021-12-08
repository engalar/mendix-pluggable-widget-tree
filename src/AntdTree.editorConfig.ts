import { Properties, StructurePreviewProps, transformGroupsIntoTabs } from "./piw-utils-internal";
import { AntdTreePreviewProps } from "../typings/AntdTreeProps";

export function getProperties(
    values: AntdTreePreviewProps,
    defaultProperties: Properties,
    platform: "web" | "desktop"
): Properties {
    console.log(values);
    if (platform === "web") {
        transformGroupsIntoTabs(defaultProperties);
    }
    return defaultProperties;
}
export function getPreview(values: AntdTreePreviewProps): StructurePreviewProps | null {
    console.log(values);
    return null;
}
