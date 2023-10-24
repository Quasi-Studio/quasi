import { ExprBlock } from "./expr";
import { ImpBlock } from "./imp";
import { IfBlockOutput, IfElseBlock } from "./if.r";
import { RootBlock, RootBlockOutput } from "./root.r";
import { StringBlock } from "./string";
import { FuncBlockOutput } from "./FuncBlockBase.r";
import { ViewBlock } from "./view.r";

export default Object.entries({
  root: RootBlock,
  string: StringBlock,
  expr: ExprBlock,
  "if-else": IfElseBlock,
  imperative: ImpBlock,
});

export type SpecialBlockOutput =
  | RootBlockOutput
  | FuncBlockOutput
  | IfBlockOutput
  | ViewBlock;
