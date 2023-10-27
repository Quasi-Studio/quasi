import { currentGraph } from "../store";

export interface TextProp {
  type: "text";
  getVal(): string;
  setVal(val: string): void;
}
export interface SwitchProp {
  type: "switch";
  getVal(): boolean;
  setVal(val: boolean): void;
}
export interface DropdownProp {
  type: "dropdown";
  options: string[];
  getVal(): string;
  setVal(val: string): void;
}

export type Prop = TextProp | SwitchProp | DropdownProp;

export type Props = Record<string, Prop>;

export function mergeProps([props0, ...propsRest]: Props[]) {
  const mergedProps: Props = {};
  for (const [k, v] of Object.entries(props0)) {
    for (const props of propsRest) {
      if (!(k in props && props[k].type === v.type)) {
        break;
      }
    }
    mergedProps[k] = v;
  }
  return mergedProps;
}

export function getSelectedProps(): Props {
  return mergeProps(
    [...currentGraph.selectedBlocks]
      .filter(
        // @ts-ignore
        (b) => typeof b["getProps"] === "function",
      )
      .map((b) => (b as any).getProps()),
  );
}
