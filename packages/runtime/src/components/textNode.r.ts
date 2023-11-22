import { ComponentContext, OutputComponent } from "refina";
import QuasiRuntime from "../plugin";
import { component, content } from "../types";

export default component({
  displayName: () => "Text",
  contents: {
    text: content("text"),
  },
});

export interface TextNodeProps {
  text: string | null;
}

@QuasiRuntime.outputComponent("qTextNode")
export class QTextNode extends OutputComponent {
  main(_: ComponentContext, props: TextNodeProps): void {
    _.t(props.text ?? "");
  }
}

declare module "refina" {
  interface OutputComponents {
    qTextNode: QTextNode;
  }
}
