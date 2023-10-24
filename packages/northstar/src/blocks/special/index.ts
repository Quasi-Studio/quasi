import { ExprBlock } from "./expr";
import { RootBlock } from "./root";
import { StringBlock } from "./string";

export default Object.entries({
  root: RootBlock,
  string: StringBlock,
  expr: ExprBlock
});
