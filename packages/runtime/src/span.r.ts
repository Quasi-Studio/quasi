import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "./plugin";

export interface SpanProps {
  inner: Content;
  class: string;
}

@QuasiRuntime.outputComponent("span")
export class QSpan extends OutputComponent {
  main(_: ComponentContext, props: SpanProps): void {
    _.$cls(props.class);
    _._span({}, props.inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    span: QSpan;
  }
}
