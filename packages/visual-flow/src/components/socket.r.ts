import { OutputComponent, OutputComponentContext, outputComponent } from "refina";
import { Socket } from "../model";

@outputComponent("vfSocket")
export class VfSocket extends OutputComponent {
  main(_: OutputComponentContext<this>, model: Socket): void {
    _.$cls`vf-socket`;
    _.$ref(model.ref) &&
      _._svgCircle({
        cx: model.cx,
        cy: model.cy,
        r: 5,
      });
  }
}

declare module "refina" {
  interface OutputComponents {
    vfSocket: VfSocket;
  }
}
