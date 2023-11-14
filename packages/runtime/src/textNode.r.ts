import { ComponentContext, OutputComponent } from "refina";
import QuasiRuntime from "./plugin";

export interface TextNodeProps {
  text: string | null;
}

@QuasiRuntime.outputComponent("textNode")
export class QTextNode extends OutputComponent {
  main(_: ComponentContext, props: TextNodeProps): void {
    _.t(props.text ?? "");
  }
}

declare module "refina" {
  interface OutputComponents {
    textNode: QTextNode;
  }
}
