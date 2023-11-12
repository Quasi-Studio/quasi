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

type ContentDisplay =
  | "as-socket"
  | "as-primary"
  | "as-primary-and-socket"
  | "as-hided-socket"
  | "as-hidable-socket";

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

type InputDisplay =
  | "as-socket"
  | "as-primary"
  | "as-primary-and-socket"
  | "as-hided-socket"
  | "as-hidable-socket";

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

type OutputDisplay = "as-socket" | "as-hided-socket" | "as-hidable-socket";

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

type EventDisplay = "as-socket" | "as-hided-socket" | "as-hidable-socket";

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

type MethodDisplay = "as-socket" | "as-hided-socket" | "as-hidable-socket";

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

export interface PropBase {
  name: string;
}

export interface TextProp extends PropBase {
  type: "text";
  defaultVal: string;
}

export function textProp(name: string, defaultVal: string = ""): TextProp {
  return {
    name,
    type: "text",
    defaultVal,
  };
}

export interface SwitchProp extends PropBase {
  type: "switch";
  defaultVal: boolean;
}

export function switchProp(
  name: string,
  defaultVal: boolean = false,
): SwitchProp {
  return {
    name,
    type: "switch",
    defaultVal,
  };
}

export interface DropdownProp extends PropBase {
  type: "dropdown";
  options: string[];
  defaultVal: string;
}

export function dropdownProp(
  name: string,
  options: string[],
  defaultVal: string,
): DropdownProp {
  return {
    name,
    type: "dropdown",
    options,
    defaultVal,
  };
}

export interface ReadonlyProp extends PropBase {
  type: "readonly";
  value: string;
}

export function readonlyProp(name: string, value: string): ReadonlyProp {
  return {
    name,
    type: "readonly",
    value,
  };
}

export interface NumberProp extends PropBase {
  type: "number";
  defaultVal: number;
  min: number;
  max: number;
}

export function numberProp(
  name: string,
  defaultVal: number,
  min: number = -Infinity,
  max: number = Infinity,
): NumberProp {
  return {
    name,
    type: "number",
    defaultVal,
    min,
    max,
  };
}

export type Prop =
  | TextProp
  | SwitchProp
  | DropdownProp
  | ReadonlyProp
  | NumberProp;
export type Props = Prop[];

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
  props: Props = [],
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
  boolean: "boolean",
  union: (a: TypeInfo, b: TypeInfo) => a + "|" + b,
};

export function contentWrapper(name: string) {
  return component(
    name,
    null,
    content("inner", "as-primary-and-socket"),
    [],
    [],
    [],
    [],
    [],
    [textProp("class")],
  );
}

export function layer(name: string) {
  return component(
    name,
    null,
    content("inner", "as-socket"),
    [],
    [],
    [],
    [],
    [],
    [textProp("class")],
  );
}
