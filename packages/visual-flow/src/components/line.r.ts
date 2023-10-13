import { Context, OutputComponent, outputComponent } from "refina";
import { Line } from "../model";
import styles from "./line.styles";

@outputComponent("vfLine")
export class VFLine extends OutputComponent {
  main(_: Context, model: Line) {
    styles.root(model.dragging)(_);

    _.$ref(model.lineRef) &&
      _._svgPath({
        d: model.linePath,
      });

    if (model.arrowSide) {
      styles.arrow(model.dragging)(_);
      _.$ref(model.arrowRef) &&
        _._svgPath({
          d: model.arrowPath,
        });
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    vfLine: VFLine;
  }
}
