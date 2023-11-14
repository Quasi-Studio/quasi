import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "./plugin";

export interface DivProps {
  inner: Content;
  class: string;
}

@QuasiRuntime.outputComponent("div")
export class QDiv extends OutputComponent {
  main(_: ComponentContext, props: DivProps): void {
    _.$cls(props.class);
    _._div({}, props.inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    div: QDiv;
  }
}
