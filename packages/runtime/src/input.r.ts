import { ComponentContext, OutputComponent, fromProp } from "refina";
import QuasiRuntime from "./plugin";

export interface InputProps {
  class: string;
  label: string;
  initial: string;
  disabled: boolean;
  onInput: (newVal: string) => void;
  validator: (value: string) => string | true;
}

export class InputModel {
  value: string;
  clear() {
    this.value = "";
  }
}

@QuasiRuntime.outputComponent("input")
export class QInput extends OutputComponent {
  main(_: ComponentContext, model: InputModel, props: InputProps): void {
    model.value ??= props.initial;
    _.$cls(props.class);
    if (_.mdTextField(fromProp(model, "value"), props.label, props.disabled)) {
      props.onInput?.(_.$ev);
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    input: QInput;
  }
}
