import { Content } from "refina";
import QuasiRuntime from "../plugin";
import { component, content, textProp } from "../types";

export default component({
  displayName: () => "Span",
  contents: {
    inner: content("inner", "as-primary-and-socket"),
  },
  props: {
    class: textProp("class"),
  },
});

export interface SpanProps {
  inner: Content;
  class: string;
}

QuasiRuntime.outputComponents.qSpan = function (_) {
  return props => {
    _.$cls(props.class);
    _._span({}, props.inner);
  };
};

declare module "refina" {
  interface Components {
    qSpan(props: SpanProps): void;
  }
}
