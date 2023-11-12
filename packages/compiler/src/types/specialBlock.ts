import { ConnectTo } from "./base";

export interface RootBlockOutput {
  type: "root";
  id: number;
  /**
   * block id of children
   */
  children: number[];
}

export interface IfBlockOutput {
  type: "if";
  id: number;
  condition: ConnectTo;
  when: ConnectTo[];
  then: ConnectTo;
  else: ConnectTo;
}

export interface ViewBlockOutput {
  type: "view";
  id: number;
  viewName: string;
  parent: ConnectTo;
}

export interface ImpBlockOutput extends Omit<FuncBlockOutput, "type"> {
  type: "imp";
  when: ConnectTo[];
  then: ConnectTo;
}

export type FuncBlockTypes =
  | "expr"
  | "imp"
  | "string"
  | "validator"
  | "state"
  | "state-setter";

export interface FuncBlockOutput {
  type: Exclude<FuncBlockTypes, "imp" | "validator" | "state" | "state-setter">;
  id: number;
  value: string;
  slots: Record<string, ConnectTo>;
  output: ConnectTo[];
}

export interface ValidatorBlockOutput {
  type: "validator";
  id: number;
  expr: string;
}

export interface StateBlockOutput extends Omit<FuncBlockOutput, "type"> {
  type: "state";
  setters: number[];
}

export interface StateSetterBlockOutput extends Omit<FuncBlockOutput, "type"> {
  type: "state-setter";
  onset: ConnectTo[];
  state: number;
}

export interface DoBlockOutput {
  type: "do";
  id: number;
  when: ConnectTo[];
  then: ConnectTo[];
}

export type SpecialBlockOutput =
  | RootBlockOutput
  | FuncBlockOutput
  | ImpBlockOutput
  | ValidatorBlockOutput
  | IfBlockOutput
  | ViewBlockOutput
  | StateBlockOutput
  | StateSetterBlockOutput
  | DoBlockOutput;
