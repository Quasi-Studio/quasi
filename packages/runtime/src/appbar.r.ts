import { ComponentContext, Content, OutputComponent, fromProp } from "refina";
import QuasiRuntime from "./plugin";
import "@refina/mdui2";

export interface AppbarProps {
  class: string;
  inner: Content;
}

@QuasiRuntime.outputComponent("appbar")
export class QAppbar extends OutputComponent {
  main(_: ComponentContext, props: AppbarProps): void {
    _.$cls(props.class);
    _.mdTopAppBar(props.inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    appbar: QAppbar;
  }
}
