import { Content, Context, OutputComponent } from "refina";
import QuasiRuntime from "../plugin";
import { Direction, component, content, input } from "../types";

export default component({
  displayName: props => (props["[else]"] ? "If else" : "If"),
  contents: {
    then: content("then", "as-socket", Direction.RIGHT),
    else: content("else", "as-hidden-socket", Direction.BOTTOM),
  },
  inputs: {
    condition: input("condition"),
  },
});

export interface IfElseProps {
  condition: boolean;
  then: Content;
  else: Content;
}

@QuasiRuntime.outputComponent("qIfElse")
export class QIfElse extends OutputComponent {
  main(_: Context, props: IfElseProps): void {
    if (props.condition) {
      _.embed(props.then);
    } else {
      _.embed(props.else);
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    qIfElse: QIfElse;
  }
}
