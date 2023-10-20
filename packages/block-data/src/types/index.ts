import { Direction } from "@quasi-dev/visual-flow";

export type TypeInfo = string;

export type PositionInfo = Direction | null;

//   | {
//       direction: Direction;
//       pos: "pre" | "post" | "default";
//     }
//   | "default";

// export function position(
//   direction: Direction,
//   pos: "pre" | "post" | "default" = "default",
// ): PositionInfo {
//   return {
//     direction,
//     pos,
//   };
// }

type ContentDisplay = "as-socket" | "as-primary" | "as-primary-and-socket";

export interface ContentInfo {
  name: string;
  kind: ContentDisplay;
  position: PositionInfo;
}

export function content(
  name: string = "inner",
  kind: ContentDisplay = "as-socket",
  position: PositionInfo = null,
): ContentInfo {
  return {
    name,
    kind,
    position,
  };
}

type InputDisplay = "as-socket" | "as-primary" | "as-primary-and-socket";

export interface InputInfo {
  name: string;
  dataType: TypeInfo;
  kind: InputDisplay;
  position: PositionInfo;
}

export function input(
  name: string,
  dataType: TypeInfo,
  kind: InputDisplay = "as-socket",
  position: PositionInfo = null,
): InputInfo {
  return {
    name,
    dataType,
    kind,
    position,
  };
}

type OutputDisplay = "as-socket";

export interface OutputInfo {
  name: string;
  dataType: TypeInfo;
  kind: OutputDisplay;
  position: PositionInfo;
}

export function output(
  name: string,
  dataType: TypeInfo,
  kind: OutputDisplay = "as-socket",
  position: PositionInfo = null,
): OutputInfo {
  return {
    name,
    dataType,
    kind,
    position,
  };
}

type EventDisplay = "as-socket";

export interface EventInfo {
  name: string;
  dataType: TypeInfo;
  kind: EventDisplay;
  position: PositionInfo;
}

export function event(
  name: string,
  dataType: TypeInfo,
  kind: EventDisplay = "as-socket",
  position: PositionInfo = null,
): EventInfo {
  return {
    name,
    dataType,
    kind,
    position,
  };
}

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

  events: EventInfo[];
  inputs: InputInfo[];
  outputs: OutputInfo[];
  plugins: PluginInfo[];
}

export function component(
  name: string,
  contents: ContentInfo[] | ContentInfo,
  events: EventInfo[] | EventInfo = [],
  inputs: InputInfo[] | InputInfo = [],
  outputs: OutputInfo[] | OutputInfo = [],
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
