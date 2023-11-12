import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "./plugin";

export interface ParagraphProps {
  inner: Content;
  class: string;
}

@QuasiRuntime.outputComponent("p")
export class QParagraph extends OutputComponent {
  main(_: ComponentContext<this>, props: ParagraphProps): void {
    _.$cls(props.class);
    _._p({}, props.inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    p: QParagraph;
  }
}
