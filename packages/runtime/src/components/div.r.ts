import { Component, Content, _ } from "refina";

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

export class QDiv extends Component {
  $main(props: DivProps) {
    _.$cls(props.class);
    _._div({}, props.inner);
  }
}
