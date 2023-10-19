import { Direction } from "@quasi-dev/visual-flow";

export type TypeInfo = string;

export type PositionInfo =
  | {
      direction: Direction;
      pos: "pre" | "post" | "default";
    }
  | "default";

export function position(
  direction: Direction,
  pos: "pre" | "post" | "default" = "default",
): PositionInfo {
  return {
    direction,
    pos,
  };
}

type ContentType =
  | "required-socket"
  | "optional-socket"
  | "hidden-by-default"
  | "as-primary"
  | "as-primary-and-socket";

export interface ContentInfo {
  name: string;
  kind: ContentType;
  position: PositionInfo;
}

export function content(
  name: string = "inner",
  kind: ContentType = "required-socket",
  position: PositionInfo = "default",
): ContentInfo {
  return {
    name,
    kind,
    position,
  };
}

type DataKind =
  | "as-required-socket"
  | "as-optional-socket"
  | "as-primary"
  | "as-primary-and-socket";

export interface DataInfo {
  name: string;
  dataType: TypeInfo;
  kind: DataKind;
  position: PositionInfo;
}

export function data(
  name: string,
  dataType: TypeInfo,
  kind: DataKind = "as-optional-socket",
  position: PositionInfo = "default",
): DataInfo {
  return {
    name,
    dataType,
    kind,
    position,
  };
}

export const output = data;
export const input = data;
export const event = data;

export interface PluginInfo {
  name: string;
  dataType: TypeInfo;
  direction: Direction;
}

export function plugin(
  name: string,
  dataType: TypeInfo,
  direction: Direction = Direction.LEFT,
): PluginInfo {
  return {
    name,
    dataType,
    direction,
  };
}

export interface ComponentInfo {
  /**
   * Display name
   */
  name: string;

  contents: ContentInfo[];

  events: DataInfo[];
  inputs: DataInfo[];
  outputs: DataInfo[];
  plugins: PluginInfo[];
}

export function component(
  name: string,
  contents: ContentInfo[] | ContentInfo,
  events: DataInfo[] | DataInfo = [],
  inputs: DataInfo[] | DataInfo = [],
  outputs: DataInfo[] | DataInfo = [],
  plugins: PluginInfo[] | PluginInfo = [],
): ComponentInfo {
  function toArray<T>(v: T[] | T) {
    return Array.isArray(v) ? v : [v];
  }
  return {
    name,
    contents: toArray(contents),
    events: toArray(events),
    inputs: toArray(inputs),
    outputs: toArray(outputs),
    plugins: toArray(plugins),
  };
}

export const t = {
  void: "void",
  string: "string",
  number: "number",
  union: (a: TypeInfo, b: TypeInfo) => a + "|" + b,
};

export function outputWrap(name: string) {
  return component(name, content("inner", "as-primary-and-socket"));
}
