import { ComponentContext, OutputComponent } from "refina";
import { Socket } from "../model";
import Vf from "../plugin";
import styles from "./socket.styles";
import { Direction } from "../types";

@Vf.outputComponent("vfSocket")
export class VfSocket extends OutputComponent {
  main(_: ComponentContext<this>, model: Socket): void {
    styles.root(model.disabled)(_);
    _.$css`transform: translate(${model.blockDisplayX}px, ${model.blockDisplayY}px) scale(${model.graph.boardScale})`;
    _.$ref(model.ref) &&
      _._svgG({}, (_) => {
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

        // _._svgText({}, model.label);
      });
  }
}

declare module "refina" {
  interface OutputComponents {
    vfSocket: VfSocket;
  }
}
