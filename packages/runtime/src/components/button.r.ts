import { Component, Content, _ } from "refina";
import { component, content, event, input, textProp } from "../types";
import { MdButton } from "@refina/mdui";

export default component({
  displayName: () => "Button",
  contents: {
    inner: content("inner", "as-primary"),
  },
  inputs: {
    disabled: input("disabled", "as-hidden-socket"),
  },
  events: {
    onClick: event("onClick"),
  },
  props: {
    class: textProp("class"),
  },
});

export interface ButtonProps {
  inner: Content;
  class: string;
  disabled: boolean;
  onClick: () => void;
}

export class QButton extends Component {
  $main(props: ButtonProps) {
    _.$cls(props.class);
    if (_(MdButton)(props.inner, props.disabled)) {
      props.onClick();
    }
  }
}
