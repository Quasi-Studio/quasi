export interface ConnectTo {
  /**
   * if this socket is not connected, `blockId` will be `NaN`
   */
  blockId: number;
  /**
   * if this socket is not connected, `blockId` will be `""`
   */
  socketName: string;
}

export interface RootBlockOutput {
  type: "root";
  id: number;
  children: ConnectTo[];
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
  | IfBlockOutput
  | ViewBlockOutput
  | ForEachBlockOutput;
