import { Content, Context, OutputComponent } from "refina";
import QuasiRuntime from "../plugin";
import { component, content, input, output } from "../types";

export default component({
  displayName: () => "For each",
  model: "ForEachModel",
  contents: {
    inner: content("inner"),
  },
  inputs: {
    iterable: input("iterable"),
  },
  outputs: {
    current: output("current"),
  },
});

export interface ForEachProps {
  inner: Content;
  iterable: Iterable<unknown>;
}

export class ForEachModel {
  current: unknown;
}

@QuasiRuntime.outputComponent("qForEach")
export class QForEach extends OutputComponent {
  main(_: Context, model: ForEachModel, props: ForEachProps): void {
    let index = 0;
    for (const v of props.iterable) {
      model.current = v;
      this.$app.pushKey(index.toString());
      _.embed(props.inner);
      this.$app.popKey(index.toString());
      index++;
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    qForEach: QForEach;
  }
}
