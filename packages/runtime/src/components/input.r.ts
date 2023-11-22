import { ComponentContext, OutputComponent, fromProp } from "refina";
import QuasiRuntime from "../plugin";
import { component, event, input, method, output, plugin, textProp } from "../types";

export default component({
  displayName: () => "Text input",
  model: "InputModel",
  inputs: {
    label: input("label", "as-primary"),
    disabled: input("disabled", "as-hidden-socket"),
  },
  outputs: {
    value: output("value"),
  },
  events: {
    onInput: event("onInput", "as-hidden-socket"),
  },
  methods: {
    clear: method("clear", "as-hidden-socket"),
  },
  plugins: {
    validator: plugin("validator", "input-plugin"),
  },
  props: {
    class: textProp("class"),
    initial: textProp("initial"),
  },
});

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

@QuasiRuntime.outputComponent("qInput")
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
    qInput: QInput;
  }
}
