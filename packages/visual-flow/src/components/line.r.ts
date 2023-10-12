import { Context, OutputComponent, outputComponent } from "refina";
import { Line } from "../model";

@outputComponent("vfLine")
export class VFLine extends OutputComponent {
  main(_: Context, model: Line) {
    _.$cls`vf-line`;
    _.$ref(model.ref) &&
      _._svgPath({
        d: model.path,
        stroke: "red",
        fill:"none"
      });
      // _._svgLine({
      //   x1: model.aPosition.x,
      //   y1: model.aPosition.y,
      //   x2: model.bPosition.x,
      //   y2: model.bPosition.y,
      //   stroke: "red",
      // });
  }
}

declare module "refina" {
  interface OutputComponents {
    vfLine: VFLine;
  }
}
