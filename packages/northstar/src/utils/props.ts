import { currentGraph } from "../store";

export interface PropDataBase {
  name: string;
}

export interface TextPropData extends PropDataBase {
  type: "text";
  getVal(): string;
  setVal(val: string): void;
}
export interface SwitchPropData extends PropDataBase {
  type: "switch";
  getVal(): boolean;
  setVal(val: boolean): void;
}
export interface DropdownPropData extends PropDataBase {
  type: "dropdown";
  options: string[];
  getVal(): string;
  setVal(val: string): void;
}

export type PropData = TextPropData | SwitchPropData | DropdownPropData;
export type PropsData = PropData[];

export function mergeProps([props0, ...propsRest]: PropsData[]) {
  const mergedProps: PropsData = [];
  for (const v of props0) {
    if (
      propsRest.every((ps) =>
        ps.some((p) => p.name === v.name && p.type === v.type),
      )
    ) {
      mergedProps.push(v);
    }
  }
  return mergedProps;
}

export function getSelectedProps(): PropsData {
  return mergeProps(
    [...currentGraph.selectedBlocks].map((b) => (b as any).getProps?.() ?? []),
  );
}
