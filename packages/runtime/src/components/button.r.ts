import { Content } from "refina";
import QuasiRuntime from "../plugin";
import { component, content, event, input, textProp } from "../types";

export default component({
  displayName: () => "Button",
  contents: {
    inner: content("inner", "as-primary"),
  },
  inputs: {
    disabled: input("disabled", "as-hidden-socket"),
  },
  events: {
    onClick: event("onClick"),
  },
  props: {
    class: textProp("class"),
  },
});

export interface ButtonProps {
  inner: Content;
  class: string;
  disabled: boolean;
  onClick: () => void;
}

QuasiRuntime.outputComponents.qButton = function (_) {
  return props => {
    _.$cls(props.class);
    if (_.mdButton(props.inner, props.disabled)) {
      props.onClick();
    }
  };
};

declare module "refina" {
  interface Components {
    qButton(props: ButtonProps): void;
  }
}
