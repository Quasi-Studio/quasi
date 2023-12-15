import { Line } from "../model";
import Vf from "../plugin";
import styles from "./line.styles";

declare module "refina" {
  interface Components {
    vfLine(model: Line): void;
  }
}
Vf.outputComponents.vfLine = function (_) {
  return model => {
    const color =
      model.colors[
        model.dragging ? "dragging" : model.hovered ? "hovered" : "default"
      ];

    styles.curve(model.dragging, model.predicting)(_);
    _.$css`stroke-width:${model.graph.boardScale * 3}px;stroke:${color}`;
    _.$ref(model.lineRef) &&
      _._svgPath({
        d: model.linePath,
      });

    styles.arrow(model.dragging, model.predicting)(_);
    _.$css`fill:${color}`;
    _.$ref(model.arrowRef) &&
      _._svgPath({
        d: model.arrowPath,
      });
  };
};
