import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "./plugin";

export interface SpanProps {
  inner: Content;
}

@QuasiRuntime.outputComponent("span")
export class QSpan extends OutputComponent {
  main(_: ComponentContext<this>, props: SpanProps): void {
    _._span({}, props.inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    span: QSpan;
  }
}
