import { OutputComponent, OutputComponentContext, byIndex, outputComponent } from "refina";
import { Block } from "../model";
import styles from "./block.styles";

@outputComponent("vfBlock")
export class VfBlock extends OutputComponent {
  main(_: OutputComponentContext<this>, model: Block): void {
    _.portal(() => {
      const { x: pageX, y: pageY } = model.pagePos;

      styles.root(model.dragging, model.attached)(_);
      _.$css`top:${pageY}px;left:${pageX}px;z-index:${model.attached ? model.zIndex : 10000}`;
      _.$ref(model.ref) &&
        _._div({}, (_) => {
          styles.svg(_);
          _._svgSvg({}, () => {
            styles.bg(model.dragging)(_);
            _._svgPath({
              d: model.backgroudPath,
            });

            _.embed(model.content);

            _.for(model.allSockets, byIndex, (socket) => {
              _.vfSocket(socket);
            });
          });
        });
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    vfBlock: VfBlock;
  }
}