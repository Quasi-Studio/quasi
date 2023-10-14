import { OutputComponent, OutputComponentContext, outputComponent } from "refina";
import { Socket } from "../../model";
import styles from "./socket.styles";

@outputComponent("vfSocket")
export class VfSocket extends OutputComponent {
  main(_: OutputComponentContext<this>, model: Socket): void {
    styles.root(_);
    _.$ref(model.ref) &&
      _._svgCircle({
        cx: model.blockDisplayX,
        cy: model.blockDisplayY,
        r: 5,
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
