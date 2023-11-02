import { ConnectTo } from "./base";
import { ComponentBlockChildren } from "./componentBlock";

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

export interface ImpBlockOutput extends FuncBlockOutput{
  when: ConnectTo;
  then: ConnectTo;
}

export type FuncBlockTypes = "expr" | "imp" | "string";

export interface FuncBlockOutput {
  type: FuncBlockTypes;
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

export type SpecialBlockOutput =
  | RootBlockOutput
  | FuncBlockOutput
  | ImpBlockOutput
  | IfBlockOutput
  | ViewBlockOutput
  | ForEachBlockOutput;
