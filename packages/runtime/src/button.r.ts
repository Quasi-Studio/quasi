import { ComponentContext, Content, OutputComponent, fromProp } from "refina";
import QuasiRuntime from "./plugin";
import "@refina/mdui";
import { Color } from "@refina/mdui";

export interface ButtonProps {
  inner: Content;
  color?: Color;
  raised?: boolean;
  disabled?: boolean;
  ripple?: boolean;
  icon?: boolean;
  onClick?: () => void;
}

@QuasiRuntime.outputComponent("qButton")
export class QButton extends OutputComponent {
  main(_: ComponentContext<this>, props: ButtonProps): void {
    if (_.mdIntrinsicButton(props.inner, props.color, props.raised, props.disabled, props.ripple, props.icon)) {
      props.onClick?.();
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    qButton: QButton;
  }
}
