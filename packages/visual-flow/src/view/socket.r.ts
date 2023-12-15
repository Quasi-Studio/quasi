import { Socket } from "../model";
import Vf from "../plugin";
import { Direction } from "../types";
import styles from "./socket.styles";

declare module "refina" {
  interface Components {
    vfSocket(model: Socket): void;
  }
}
Vf.outputComponents.vfSocket = function (_) {
  return model => {
    styles.root(model.disabled)(_);
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
          styles.label(model.disabled)(_);
          _._svgText(model.labelBoardPos, model.label);
        }
      });
  };
};
