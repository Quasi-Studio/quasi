import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "../plugin";
import { component, content, textProp } from "../types";

export default component({
  displayName: () => "Div",
  contents: {
    inner: content("inner"),
  },
  props: {
    class: textProp("class"),
  },
});

export interface DivProps {
  inner: Content;
  class: string;
}

@QuasiRuntime.outputComponent("qDiv")
export class QDiv extends OutputComponent {
  main(_: ComponentContext, props: DivProps): void {
    _.$cls(props.class);
    _._div({}, props.inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    qDiv: QDiv;
  }
}
