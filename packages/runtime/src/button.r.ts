import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "./plugin";

export interface ButtonProps {
  inner: Content;
  color: "primary" | "accent" | "unset";
  raised: boolean;
  disabled: boolean;
  ripple: boolean;
  icon: boolean;
  onClick: () => void;
}

@QuasiRuntime.outputComponent("button")
export class QButton extends OutputComponent {
  main(_: ComponentContext<this>, props: ButtonProps): void {
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
