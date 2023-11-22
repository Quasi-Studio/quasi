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
