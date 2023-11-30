import { Content, Context, OutputComponent } from "refina";
import QuasiRuntime from "../plugin";
import { component, content, textProp } from "../types";

export default component({
  displayName: () => "Paragraph",
  contents: {
    inner: content("inner"),
  },
  props: {
    class: textProp("class"),
  },
});

export interface ParagraphProps {
  inner: Content;
  class: string;
}

@QuasiRuntime.outputComponent("qParagraph")
export class QParagraph extends OutputComponent {
  main(_: Context, props: ParagraphProps): void {
    _.$cls(props.class);
    _._p({}, props.inner);
  }
}

declare module "refina" {
  interface OutputComponents {
    qParagraph: QParagraph;
  }
}
