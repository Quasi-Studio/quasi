import { Component, _ } from "refina";
import { Socket } from "../model";
import { Direction } from "../types";
import useStyles from "./socket.styles";

export class VfSocket extends Component {
  $main(model: Socket) {
    const styles = useStyles(model.disabled);

    styles.root();
    _.$css`transform: translate(${model.blockDisplayX}px, ${model.blockDisplayY}px) scale(${model.graph.boardScale})`;
    _.$ref(model.ref) &&
      _._svgG({}, _ => {
        _.$css`transform: rotate(${
          {
            [Direction.LEFT]: 180,
            [Direction.TOP]: 270,
            [Direction.RIGHT]: 0,
            [Direction.BOTTOM]: 90,
          }[model.direction]
        }deg)`;
        _._svgPath({
          d: model.path,
        });

        if (!model.hideLabel) {
          styles.label();
          _._svgText(model.labelBoardPos, model.label);
        }
      });
  }
}
