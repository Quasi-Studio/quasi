import { Content, TriggerComponent, _, Model } from "refina";
import { Block, Graph } from "../model";
import useStyles from "./creator.styles";

const DRAGGING_START_PADDING = 20;

export class VfCreator extends TriggerComponent<void> {
  $main(
    graph: Graph,
    inner: Content,
    factory: () => Block,
    disabled?: Model<boolean>,
  ): this is {
    $ev: void;
  } {
    const styles = useStyles();

    styles.root();
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
          this.$update();
        },
      },
      inner,
    );
    return this.$fired;
  }
}
