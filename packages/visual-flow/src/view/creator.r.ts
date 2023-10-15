import { Content, D, TriggerComponent, TriggerComponentContext, triggerComponent } from "refina";
import { Block, Graph } from "../model";
import styles from "./creator.styles";

const DRAGGING_START_PADDING = 20;

@triggerComponent("vfCreator")
export class VfCreator extends TriggerComponent<void> {
  main(_: TriggerComponentContext<void, this>, graph: Graph, inner: D<Content>, factory: () => Block): void {
    styles.root(_);
    _._div(
      {
        onmousedown: (ev) => {
          ev.preventDefault();
          const block = factory();

          const padding = graph.boardScale * DRAGGING_START_PADDING;
          block.nonAttachedPageX = ev.pageX - padding;
          block.nonAttachedPageY = ev.pageY - padding;

          graph.addBlock(block);

          _.$fire();
          _.$update();
        },
      },
      inner,
    );
  }
}

declare module "refina" {
  interface TriggerComponents {
    vfCreator: VfCreator;
  }
}
