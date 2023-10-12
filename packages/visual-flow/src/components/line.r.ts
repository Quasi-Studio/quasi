import { Context, OutputComponent, outputComponent } from "refina";
import { Line } from "../model";

@outputComponent("vfLine")
export class VFLine extends OutputComponent {
  main(_: Context, model: Line) {
    _.$cls`vf-line`
    _.$ref(model.ref) &&
      _._svgLine({
        d: model.path,
        fill: "red",
      });
  }
}

declare module "refina" {
  interface OutputComponents {
    vfLine: VFLine;
  }
}
