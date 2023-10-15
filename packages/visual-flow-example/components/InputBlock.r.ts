import { RectBlock } from "@quasi-dev/visual-flow";
import "@refina/fluentui";
import { Context, d } from "refina";

export class InputBlock extends RectBlock {
  text = d("111");

  content = (_: Context) => {
    _.fTextInput(this.text);
  };
}
