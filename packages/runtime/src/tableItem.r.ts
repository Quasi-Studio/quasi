import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "./plugin";
import { TableModel, currentTableSymbol } from "./table.r";

export interface TableColProps {
  inner: Content;
  prop: string;
  header: string;
  "head class": string;
  "cell class": string;
}

export class TableColModel {
  value: any;
}

@QuasiRuntime.outputComponent("tableCol")
export class QTableCol extends OutputComponent {
  main(_: ComponentContext<this>, model: TableColModel, props: TableColProps): void {
    const currentTable = _.$runtimeData[currentTableSymbol] as TableModel;
    if (currentTable.renderingState === "head") {
      _.$cls(props["head class"]);
      _.mdTableHeader(props.header === "$prop" ? props.prop : props.header);
    } else {
      model.value = currentTable.current[props.prop];
      _.$cls(props["cell class"]);
      _.mdTableCell(props.inner);
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    tableCol: QTableCol;
  }
}
