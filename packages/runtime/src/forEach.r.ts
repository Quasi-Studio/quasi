import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "./plugin";

export interface ForEachProps {
  inner: Content;
  iterable: Iterable<unknown>;
}

export class ForEachModel {
  current: unknown;
}

@QuasiRuntime.outputComponent("forEach")
export class QForEach extends OutputComponent {
  main(_: ComponentContext<this>, model: ForEachModel, props: ForEachProps): void {
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
    forEach: QForEach;
  }
}
