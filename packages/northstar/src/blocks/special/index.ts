import { ExprBlock } from "./expr";
import { IfElseBlock } from "./if.r";
import { RootBlock } from "./root";
import { StringBlock } from "./string";

export default Object.entries({
  root: RootBlock,
  string: StringBlock,
  expr: ExprBlock,
  "if-else": IfElseBlock,
});
