import { ExprBlock } from "./expr";
import { IfElseBlock } from "./if.r";
import { ImpBlock } from "./imp";
import { StateBlock } from "./state";
import { StringBlock } from "./string";
import { ValidatorBlock } from "./validator";
import { StateSetterBlock } from "./stateSetter.r";

export default Object.entries({
  // root: RootBlock,
  string: StringBlock,
  expr: ExprBlock,
  "if-else": IfElseBlock,
  imperative: ImpBlock,
  validator: ValidatorBlock,
  state: StateBlock,
  stateSetter: StateSetterBlock,
});
