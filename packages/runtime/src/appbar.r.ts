import { ComponentContext, Content, OutputComponent, fromProp } from "refina";
import QuasiRuntime from "./plugin";
import "@refina/mdui";
import { AppbarType, Color } from "@refina/mdui";

export interface AppbarProps {
  inner: Content;
  type: AppbarType;
}

@QuasiRuntime.outputComponent("qAppbar")
export class QAppbar extends OutputComponent {
  main(_: ComponentContext<this>, props: AppbarProps): void {
    _.mdAppbar(props.type, props.inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    qAppbar: QAppbar;
  }
}
