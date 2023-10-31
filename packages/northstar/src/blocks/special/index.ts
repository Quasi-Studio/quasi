import { FuncBlockOutput } from "./FuncBlockBase.r";
import { ExprBlock } from "./expr";
import { ForEachBlock, ForEachBlockOutput } from "./forEach.r";
import { IfBlockOutput, IfElseBlock } from "./if.r";
import { ImpBlock } from "./imp";
import { RootBlock, RootBlockOutput } from "./root.r";
import { StringBlock } from "./string";
import { ViewBlockOutput } from "./view.r";

export default Object.entries({
  root: RootBlock,
  string: StringBlock,
  expr: ExprBlock,
  "if-else": IfElseBlock,
  imperative: ImpBlock,
  "for-each": ForEachBlock,
});

export type SpecialBlockOutput =
  | RootBlockOutput
  | FuncBlockOutput
  | IfBlockOutput
  | ViewBlockOutput
  | ForEachBlockOutput;
