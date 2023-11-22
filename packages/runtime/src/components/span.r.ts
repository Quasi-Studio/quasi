import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "../plugin";
import { component, content, textProp } from "../types";

export default component({
  displayName: () => "Span",
  contents: {
    inner: content("inner"),
  },
  props: {
    class: textProp("class"),
  },
});

export interface SpanProps {
  inner: Content;
  class: string;
}

@QuasiRuntime.outputComponent("qSpan")
export class QSpan extends OutputComponent {
  main(_: ComponentContext, props: SpanProps): void {
    _.$cls(props.class);
    _._span({}, props.inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    qSpan: QSpan;
  }
}
