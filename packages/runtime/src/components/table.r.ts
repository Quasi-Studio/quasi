import { MdTable } from "@refina/mdui";
import { Component, Content, _, byIndex, bySelf } from "refina";
import {
  Direction,
  component,
  content,
  input,
  output,
  textProp,
} from "../types";

export default component({
  displayName: () => "Table",
  contents: { inner: content("inner", "as-socket", Direction.BOTTOM) },
  inputs: {
    data: input("data"),
  },
  outputs: {
    current: output("current", "as-hidable-socket", Direction.RIGHT),
    renderingState: output(
      "renderingState",
      "as-hidden-socket",
      Direction.RIGHT,
    ),
  },
  props: {
    class: textProp("class"),
    key: textProp("key", "$index"),
  },
});

export const currentTableSymbol = Symbol("currentTable");

export interface TableProps {
  inner: Content;
  class: string;
  data: Iterable<any>;
  key: string;
}

export class TableModel {
  renderingState: "head" | "body";
  current: any;
}

export class QTable extends Component {
  $main(model: TableModel, props: TableProps) {
    _.$cls(props.class);
    _.provide(currentTableSymbol, model, _ => {
      _(MdTable)(
        props.data,
        _ => {
          model.renderingState = "head";
          _.embed(props.inner);
        },
        props.key === "$index"
          ? byIndex
          : props.key === "$self"
          ? bySelf
          : props.key,
        v => {
          model.renderingState = "body";
          model.current = v;
          _.embed(props.inner);
        },
      );
      model.current = null;
    });
  }
}
