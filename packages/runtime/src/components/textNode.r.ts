import { Context, OutputComponent } from "refina";
import QuasiRuntime from "../plugin";
import { component, content, input } from "../types";

export default component({
  displayName: () => "Text",
  inputs: {
    text: input("text", "as-primary-and-socket"),
  },
});

export interface TextNodeProps {
  text: string | null;
}

@QuasiRuntime.outputComponent("qTextNode")
export class QTextNode extends OutputComponent {
  main(_: Context, props: TextNodeProps): void {
    _.t(props.text ?? "");
  }
}

declare module "refina" {
  interface OutputComponents {
    qTextNode: QTextNode;
  }
}
