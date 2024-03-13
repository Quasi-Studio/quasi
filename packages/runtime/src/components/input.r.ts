import { Component, _, propModel } from "refina";
import { MdPasswordInput, MdTextField } from "@refina/mdui";
import {
  component,
  dropdownProp,
  event,
  input,
  method,
  output,
  plugin,
  textProp,
} from "../types";

export default component({
  displayName: props =>
    (
      ({
        text: "Text input",
        password: "Pwd input",
        number: "Num input",
      }) as any
    )[props.type] ?? "Input",
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
    type: dropdownProp("type", ["text", "password", "number"], "text"),
    class: textProp("class"),
    initial: textProp("initial"),
  },
});

export interface InputProps {
  type: string;
  class: string;
  label: string;
  initial: string;
  disabled: boolean;
  onInput: (newVal: string | number) => void;
  validator: (value: string) => string | true;
}

export class InputModel {
  type: string;
  _value: string;
  clear() {
    this._value = "";
  }
  set value(value: string | number) {
    this._value = String(value);
  }
  get value() {
    return this.type === "number" ? +this._value : this._value;
  }
}

export class QInput extends Component {
  $main(model: InputModel, props: InputProps) {
    model.type = props.type;
    model.value ??= props.initial;
    _.$cls(props.class);
    _.$css`margin-bottom:18px;`;
    if (
      props.type === "password"
        ? _(MdPasswordInput)(
            propModel(model, "_value"),
            props.label,
            props.disabled,
          )
        : _(MdTextField)(
            propModel(model, "_value"),
            props.label,
            props.disabled,
          )
    ) {
      //@ts-ignore
      const newVal = _.$ev as string;
      props.onInput?.(props.type === "number" ? +newVal : newVal);
    }
  }
}
