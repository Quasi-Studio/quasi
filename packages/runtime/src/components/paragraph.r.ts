import { Component, Content, _ } from "refina";

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

export class QParagraph extends Component {
  $main(props: ParagraphProps) {
    _.$cls(props.class);
    _._p({}, props.inner);
  }
}
