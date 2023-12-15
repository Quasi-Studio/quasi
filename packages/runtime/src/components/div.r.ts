import { Content } from "refina";
import QuasiRuntime from "../plugin";
import { component, content, textProp } from "../types";

export default component({
  displayName: () => "Div",
  contents: {
    inner: content("inner"),
  },
  props: {
    class: textProp("class"),
  },
});

export interface DivProps {
  inner: Content;
  class: string;
}

QuasiRuntime.outputComponents.qDiv = function (_) {
  return props => {
    _.$cls(props.class);
    _._div({}, props.inner);
  };
};

declare module "refina" {
  interface Components {
    qDiv(props: DivProps): void;
  }
}
