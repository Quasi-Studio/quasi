import { Component, _ } from "refina";
import { component, input } from "../types";

export default component({
  displayName: () => "Text",
  inputs: {
    text: input("text", "as-primary-and-socket"),
  },
});

export interface TextNodeProps {
  text: string | null;
}

export class QTextNode extends Component {
  $main(props: TextNodeProps) {
    _.t(props.text ?? "");
  }
}
