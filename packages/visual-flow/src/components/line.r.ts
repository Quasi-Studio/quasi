import { Context, OutputComponent, outputComponent } from "refina";
import { Line } from "../model";
import styles from "./line.styles";

@outputComponent("vfLine")
export class VFLine extends OutputComponent {
  main(_: Context, model: Line) {
    styles.root(model.dragging)(_);
    _.$ref(model.ref) &&
      _._svgPath({
        d: model.path,
      });
  }
}

declare module "refina" {
  interface OutputComponents {
    vfLine: VFLine;
  }
}
