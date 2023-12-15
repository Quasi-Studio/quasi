import { Content } from "refina";
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

QuasiRuntime.outputComponents.qParagraph = function (_) {
  return props => {
    _.$cls(props.class);
    _._p({}, props.inner);
  };
};

declare module "refina" {
  interface Components {
    qParagraph(props: ParagraphProps): void;
  }
}
