import { ComponentContext, Content, OutputComponent, fromProp } from "refina";
import QuasiRuntime from "./plugin";
import "@refina/mdui";
import { AppbarType, Color } from "@refina/mdui";

export interface AppbarProps {
  inner: Content;
  type: AppbarType;
  colored: boolean;
}

@QuasiRuntime.outputComponent("appbar")
export class QAppbar extends OutputComponent {
  main(_: ComponentContext<this>, props: AppbarProps): void {
    _.mdAppbar(props.type, _ => {
      _.mdToolbar(props.inner, props.colored);
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    appbar: QAppbar;
  }
}
