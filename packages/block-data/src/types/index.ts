import { View } from "refina";
import { ComponentBlock } from "../block/ComponentBlock.r";

export type ComponentParamType =
  | readonly ["content"]
  | readonly ["output", string]
  | readonly ["input", string]
  | readonly ["singleOutput", string];

export const content = ["content"] as const;
export const output = (type: string) => ["output", type] as const;
export const input = (type: string) => ["input", type] as const;

export interface ComponentParamRaw {
  name: string;
  type: ComponentParamType;
  /**
   * The way to display the parameter.
   * If "both", it displays both in block content and as a socket.
   */
  noSocket?: boolean;
  optional?: boolean;
}

export type ComponentKind = "output" | "trigger";

export interface ComponentInfo {
  kind: ComponentKind;
  displayName?: string;
  params: ComponentParamRaw[];

  content?: View<[block: ComponentBlock]>;
}
