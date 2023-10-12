import { OutputComponent, OutputComponentContext, outputComponent } from "refina";
import { Socket } from "../model";
import styles from "./socket.styles";

@outputComponent("vfSocket")
export class VfSocket extends OutputComponent {
  main(_: OutputComponentContext<this>, model: Socket): void {
    styles.root(_);
    _.$ref(model.ref) &&
      _._svgCircle({
        cx: model.blockX,
        cy: model.blockY,
        r: 5,
      });
  }
}

declare module "refina" {
  interface OutputComponents {
    vfSocket: VfSocket;
  }
}
