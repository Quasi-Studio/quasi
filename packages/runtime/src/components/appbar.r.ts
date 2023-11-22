import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "../plugin";
import { component, content, textProp } from "../types";

export default component({
  displayName: () => "Appbar",
  contents: {
    inner: content("inner", "as-socket"),
  },
  props: {
    class: textProp("class"),
  },
});

export interface AppbarProps {
  class: string;
  inner: Content;
}

@QuasiRuntime.outputComponent("qAppbar")
export class QAppbar extends OutputComponent {
  main(_: ComponentContext, props: AppbarProps): void {
    _.$cls(props.class);
    _.mdTopAppBar(props.inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    qAppbar: QAppbar;
  }
}
