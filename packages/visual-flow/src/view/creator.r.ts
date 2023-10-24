import { ComponentContext, Content, D, TriggerComponent } from "refina";
import { Block, Graph } from "../model";
import Vf from "../plugin";
import styles from "./creator.styles";

const DRAGGING_START_PADDING = 20;

@Vf.triggerComponent("vfCreator")
export class VfCreator extends TriggerComponent<void> {
  main(
    _: ComponentContext<this>,
    graph: Graph,
    inner: D<Content>,
    factory: () => Block,
    disabled: D<boolean> = false,
  ): void {
    styles.root(_);
    _._div(
      {
        onmousedown: ev => {
          if (disabled) return;
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

          this.$fire();
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
