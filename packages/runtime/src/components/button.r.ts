import { Content, Context, OutputComponent } from "refina";
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

@QuasiRuntime.outputComponent("qButton")
export class QButton extends OutputComponent {
  main(_: Context, props: ButtonProps): void {
    _.$cls(props.class);
    if (_.mdButton(props.inner, props.disabled)) {
      props.onClick();
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    qButton: QButton;
  }
}
