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
  when: ConnectTo;
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
  when: ConnectTo;
  then: ConnectTo;
}

export type FuncBlockTypes = "expr" | "imp" | "string" | "validator";

export interface FuncBlockOutput {
  type: Exclude<FuncBlockTypes, "imp" | "validator">;
  id: number;
  value: string;
  inputs: {
    /**
     * slot name. i.e. function parameter name
     */
    slot: string;
    /**
     * connected block id
     */
    blockId: number;
    /**
     * connected line start end socket name
     */
    socketName: string;
  }[];
  output: ConnectTo[];
}

export interface ForEachBlockOutput {
  type: "for-each";
  id: number;
  parent: ConnectTo;
  children: ConnectTo[];
  input: ConnectTo;
  output: ConnectTo[];
}

export interface ValidatorBlockOutput {
  type: "validator";
  id: number;
  expr: string;
}

export type SpecialBlockOutput =
  | RootBlockOutput
  | FuncBlockOutput
  | ImpBlockOutput
  | ValidatorBlockOutput
  | IfBlockOutput
  | ViewBlockOutput
  | ForEachBlockOutput;
