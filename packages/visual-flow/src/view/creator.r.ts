import { Content, D, } from "refina";
import { Block, Graph } from "../model";
import Vf from "../plugin";
import styles from "./creator.styles";

const DRAGGING_START_PADDING = 20;

declare module "refina" {
  interface Components {
    vfCreator(
      graph: Graph,
      inner: D<Content>,
      factory: () => Block,
      disabled?: D<boolean>,
    ): this is {
      $ev: void;
    };
  }
}
Vf.triggerComponents.vfCreator = function (_) {
  return (graph, inner, factory, disabled = false) => {
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
  };
};
