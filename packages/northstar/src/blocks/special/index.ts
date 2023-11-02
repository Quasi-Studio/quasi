import { ExprBlock } from "./expr";
import { ForEachBlock } from "./forEach.r";
import { IfElseBlock } from "./if.r";
import { ImpBlock } from "./imp";
import { StringBlock } from "./string";
import { ValidatorBlock } from "./validator";

export default Object.entries({
  // root: RootBlock,
  string: StringBlock,
  expr: ExprBlock,
  "if-else": IfElseBlock,
  imperative: ImpBlock,
  "for-each": ForEachBlock,
  validator: ValidatorBlock,
});
