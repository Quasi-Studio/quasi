import { ComponentContext, OutputComponent, fromProp } from "refina";
import QuasiRuntime from "./plugin";
import "@refina/mdui";

export interface InputProps {
  label?: string;
  disabled?: boolean;
  onInput?: (newVal: string) => void;
}

export class InputModel {
  value: string = "";
}

@QuasiRuntime.outputComponent("input")
export class QInput extends OutputComponent {
  main(_: ComponentContext<this>, model: InputModel, props: InputProps): void {
    if (_.mdInput(fromProp(model, "value"), props.label, props.disabled)) {
      props.onInput?.(_.$ev);
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    input: QInput;
  }
}
