import QuasiRuntime from "../plugin";
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

declare module "refina" {
  interface Components {
    qTextNode(props: TextNodeProps): void;
  }
}

QuasiRuntime.outputComponents.qTextNode = function (_) {
  return props => {
    _.t(props.text ?? "");
  };
};
