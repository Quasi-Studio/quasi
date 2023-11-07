import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "./plugin";

export interface DivProps {
  inner: Content;
}

@QuasiRuntime.outputComponent("div")
export class QDiv extends OutputComponent {
  main(_: ComponentContext<this>, props: DivProps): void {
    _._div({}, props.inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    div: QDiv;
  }
}
