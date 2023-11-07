import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "./plugin";

export interface IfElseProps {
  condition: boolean;
  then: Content;
  else: Content;
}

@QuasiRuntime.outputComponent("ifElse")
export class QIfElse extends OutputComponent {
  main(_: ComponentContext<this>, props: IfElseProps): void {
    if (props.condition) {
      _.embed(props.then);
    } else {
      _.embed(props.else);
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    ifElse: QIfElse;
  }
}
