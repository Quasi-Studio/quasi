import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "./plugin";

export interface ButtonProps {
  inner: Content;
  class: string;
  disabled: boolean;
  onClick: () => void;
}

@QuasiRuntime.outputComponent("button")
export class QButton extends OutputComponent {
  main(_: ComponentContext, props: ButtonProps): void {
    _.$cls(props.class);
    if (_.mdButton(props.inner, props.disabled)) {
      props.onClick();
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    button: QButton;
  }
}
