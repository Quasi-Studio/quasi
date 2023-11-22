import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "../plugin";
import { Direction, component, content, input, output, textProp } from "../types";
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

@QuasiRuntime.outputComponent("qTableCol")
export class QTableCol extends OutputComponent {
  main(_: ComponentContext, model: TableColModel, props: TableColProps): void {
    const currentTable = _.$runtimeData[currentTableSymbol] as TableModel;
    if (currentTable.renderingState === "head") {
      _.$cls(props.headClass);
      _.mdTableHeader(props.header === "$prop" ? props.prop : props.header);
    } else {
      model.value = currentTable.current[props.prop];
      _.$cls(props.cellClass);
      _.mdTableCell(props.inner);
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    qTableCol: QTableCol;
  }
}
