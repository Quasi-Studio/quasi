import {
  ComponentContext,
  Content,
  OutputComponent,
  byIndex,
  bySelf,
} from "refina";
import QuasiRuntime from "../plugin";
import { component, content, input, output, textProp } from "../types";

export default component({
  displayName: () => "List",
  contents: {
    inner: content("inner"),
  },
  inputs: {
    data: input("data"),
  },
  outputs: {
    current: output("current"),
  },
  props: {
    class: textProp("class"),
    key: textProp("key", "$index"),
  },
});

export interface ListProps {
  inner: Content;
  class: string;
  data: Iterable<any>;
  key: string;
}

export class ListModel {
  current: any;
}

@QuasiRuntime.outputComponent("qList")
export class QList extends OutputComponent {
  main(_: ComponentContext, model: ListModel, props: ListProps): void {
    _.$cls(props.class);
    _.mdList(
      props.data,
      props.key === "$index"
        ? byIndex
        : props.key === "$self"
        ? bySelf
        : props.key,
      v => {
        model.current = v;
        _.embed(props.inner);
      },
    );
    model.current = null;
  }
}

declare module "refina" {
  interface OutputComponents {
    qList: QList;
  }
}
