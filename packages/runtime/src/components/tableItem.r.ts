import { Content } from "refina";
import QuasiRuntime from "../plugin";
import {
  Direction,
  component,
  content,
  input,
  output,
  textProp,
} from "../types";
import { TableModel, currentTableSymbol } from "./table.r";

export default component({
  displayName: () => "Table Col",
  model: "TableColModel",
  contents: {
    inner: content("inner"),
  },
  inputs: {
    prop: input("prop", "as-primary"),
  },
  outputs: {
    value: output("value", "as-hidable-socket", Direction.TOP),
  },
  props: {
    header: textProp("header", "$prop"),
    headClass: textProp("head class"),
    cellClass: textProp("cell class"),
  },
});

export interface TableColProps {
  inner: Content;
  prop: string;
  header: string;
  headClass: string;
  cellClass: string;
}

export class TableColModel {
  value: any;
}

declare module "refina" {
  interface Components {
    qTableCol(model: TableColModel, props: TableColProps): void;
  }
}

QuasiRuntime.outputComponents.qTableCol = function (_) {
  return (model, props) => {
    const currentTable = _.$runtimeData[currentTableSymbol] as TableModel;
    if (currentTable.renderingState === "head") {
      _.$cls(props.headClass);
      _.mdTableHeader(props.header === "$prop" ? props.prop : props.header);
    } else {
      model.value = currentTable.current[props.prop];
      _.$cls(props.cellClass);
      _.mdTableCell(props.inner);
    }
  };
};
