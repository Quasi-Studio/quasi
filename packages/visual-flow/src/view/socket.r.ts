import { OutputComponent, OutputComponentContext } from "refina";
import { Socket } from "../model";
import Vf from "../plugin";
import styles from "./socket.styles";

@Vf.outputComponent("vfSocket")
export class VfSocket extends OutputComponent {
  main(_: OutputComponentContext<this>, model: Socket): void {
    styles.root(_);
    _.$ref(model.ref) &&
      _._svgCircle({
        cx: model.blockDisplayX,
        cy: model.blockDisplayY,
        r: model.blockDisplayRadius,
      });
    _._svgText(
      {
        x: model.blockDisplayX,
        y: model.blockDisplayY,
      },
      model.label,
    );
  }
}

declare module "refina" {
  interface OutputComponents {
    vfSocket: VfSocket;
  }
}
