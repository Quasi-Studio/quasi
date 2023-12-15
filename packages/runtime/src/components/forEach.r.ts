import { Content, RefTreeNode } from "refina";
import QuasiRuntime from "../plugin";
import { Direction, component, content, input, output } from "../types";

export default component({
  displayName: () => "For each",
  model: "ForEachModel",
  contents: {
    inner: content("inner", "as-socket", Direction.BOTTOM),
  },
  inputs: {
    iterable: input("iterable"),
  },
  outputs: {
    current: output("current", "as-socket", Direction.RIGHT),
  },
});

export interface ForEachProps {
  inner: Content;
  iterable: Iterable<unknown>;
}

export class ForEachModel {
  current: unknown;
}

QuasiRuntime.outputComponents.qForEach = function (_) {
  const refTreeNodes: Record<string, RefTreeNode> = {};
  return (model, props) => {
    const parentRefTreeNode = _.$intrinsic.$$currentRefTreeNode;

    let index = 0;
    for (const v of props.iterable) {
      model.current = v;

      const key = index.toString();

      refTreeNodes[key] ??= {};
      _.$intrinsic.$$currentRefTreeNode = refTreeNodes[key];

      _.embed(props.inner);

      index++;
    }

    _.$intrinsic.$$currentRefTreeNode = parentRefTreeNode;
  };
};

declare module "refina" {
  interface Components {
    qForEach(model: ForEachModel, props: ForEachProps): void;
  }
}
