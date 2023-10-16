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
          const { x: boardX, y: boardY } = graph.pagePos2BoardPos({
            x: ev.pageX - padding,
            y: ev.pageY - padding,
          });
          block.boardX = boardX;
          block.boardY = boardY;

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
