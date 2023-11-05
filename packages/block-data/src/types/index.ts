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

type MethodDisplay = "as-socket";

export interface MethodInfo {
  name: string;
  argTypes: TypeInfo[];
  kind: MethodDisplay;
  position: PositionInfo;
}

export function method(
  name: string,
  argTypes: TypeInfo[],
  kind: MethodDisplay = "as-socket",
  position: PositionInfo = null,
): MethodInfo {
  return {
    name,
    argTypes: argTypes,
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

export interface TextProp {
  type: "text";
  defaultVal: string;
}

export function textProp(defaultVal: string = ""): TextProp {
  return {
    type: "text",
    defaultVal,
  };
}

export interface SwitchProp {
  type: "switch";
  defaultVal: boolean;
}

export function switchProp(defaultVal: boolean = false): SwitchProp {
  return {
    type: "switch",
    defaultVal,
  };
}

export interface DropdownProp {
  type: "dropdown";
  options: string[];
  defaultVal: string;
}

export function dropdownProp(
  options: string[],
  defaultVal: string,
): DropdownProp {
  return {
    type: "dropdown",
    options,
    defaultVal,
  };
}

export type Props = Record<string, TextProp | SwitchProp | DropdownProp>;

export interface ComponentInfo {
  /**
   * Display name
   */
  name: string;

  modelAllocator: string | null;

  contents: ContentInfo[];

  inputs: InputInfo[];
  outputs: OutputInfo[];
  events: EventInfo[];
  methods: MethodInfo[];
  plugins: PluginInfo[];

  props: Props;
}

export function component(
  name: string,
  modelAllocator: string | null,
  contents: ContentInfo[] | ContentInfo = [],
  inputs: InputInfo[] | InputInfo = [],
  outputs: OutputInfo[] | OutputInfo = [],
  events: EventInfo[] | EventInfo = [],
  methods: MethodInfo[] | MethodInfo = [],
  plugins: PluginInfo[] | PluginInfo = [],
  props: Props = {},
): ComponentInfo {
  function toArray<T>(v: T[] | T) {
    return Array.isArray(v) ? v : [v];
  }
  return {
    name,
    modelAllocator,
    contents: toArray(contents),
    inputs: toArray(inputs),
    outputs: toArray(outputs),
    events: toArray(events),
    methods: toArray(methods),
    plugins: toArray(plugins),
    props,
  };
}

export const t = {
  void: "void",
  string: "string",
  number: "number",
  union: (a: TypeInfo, b: TypeInfo) => a + "|" + b,
};

export function contentWrapper(name: string) {
  return component(name, null, content("inner", "as-primary-and-socket"));
}

export function layer(name: string) {
  return component(name, null, content("inner", "as-socket"));
}
