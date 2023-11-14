import { ComponentContext, Content, OutputComponent, byIndex, byProp, bySelf } from "refina";
import QuasiRuntime from "./plugin";

export interface ListProps {
  inner: Content;
  class: string;
  data: Iterable<any>;
  key: string;
}

export class ListModel {
  current: any;
}

@QuasiRuntime.outputComponent("list")
export class QList extends OutputComponent {
  main(_: ComponentContext, model: ListModel, props: ListProps): void {
    _.$cls(props.class);
    _.mdList(props.data, props.key === "$index" ? byIndex : props.key === "$self" ? bySelf : byProp(props.key), v => {
      model.current = v;
      _.embed(props.inner);
    });
    model.current = null;
  }
}

declare module "refina" {
  interface OutputComponents {
    list: QList;
  }
}
