import { ComponentContext, OutputComponent, fromProp } from "refina";
import QuasiRuntime from "./plugin";

export interface InputProps {
  class: string;
  label: string;
  disabled: boolean;
  onInput: (newVal: string) => void;
  validator: (value: string) => string | true;
}

export class InputModel {
  value: string = "";
  clear() {
    this.value = "";
  }
}

@QuasiRuntime.outputComponent("input")
export class QInput extends OutputComponent {
  main(_: ComponentContext<this>, model: InputModel, props: InputProps): void {
    _.$cls(props.class);
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
