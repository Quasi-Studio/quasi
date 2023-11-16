import { ComponentContext, Content, OutputComponent, byIndex, bySelf } from "refina";
import QuasiRuntime from "./plugin";

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

@QuasiRuntime.outputComponent("table")
export class QTable extends OutputComponent {
  main(_: ComponentContext, model: TableModel, props: TableProps): void {
    _.provide(currentTableSymbol, model, _ => {
      _.$cls(props.class);
      _.mdTable(
        props.data,
        _ => {
          model.renderingState = "head";
          _.embed(props.inner);
        },
        props.key === "$index" ? byIndex : props.key === "$self" ? bySelf : props.key,
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

declare module "refina" {
  interface OutputComponents {
    table: QTable;
  }
}
