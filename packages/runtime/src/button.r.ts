import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "./plugin";

export interface ButtonProps {
  inner: Content;
  class: string;
  color: "primary" | "accent" | "unset";
  raised: boolean;
  disabled: boolean;
  ripple: boolean;
  icon: boolean;
  onClick: () => void;
}

@QuasiRuntime.outputComponent("button")
export class QButton extends OutputComponent {
  main(_: ComponentContext, props: ButtonProps): void {
    _.$cls(props.class);
    if (
      _.mdIntrinsicButton(
        props.inner,
        props.color === "unset" ? undefined : props.color,
        props.raised,
        props.disabled,
        props.ripple,
        props.icon,
      )
    ) {
      props.onClick();
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    button: QButton;
  }
}
