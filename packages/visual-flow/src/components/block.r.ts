import { OutputComponent, OutputComponentContext, byIndex, outputComponent } from "refina";
import { Block } from "../model";
import styles from "./block.styles";

@outputComponent("vfBlock")
export class VfBlock extends OutputComponent {
  main(_: OutputComponentContext<this>, model: Block): void {
    _.portal(() => {
      styles.root(model.dragging)(_);
      _.$css`top:${model.pageY}px;left:${model.pageX}px;z-index:${model.zIndex}`;
      _.$ref(model.ref) &&
        _._div({}, (_) => {
          styles.svg(_);
          _.$css`width:${model.width}px;height:${model.height}px;`;
          _._svgSvg({}, () => {
            styles.bg(model.dragging)(_);
            _._svgPath({
              d: model.path,
            });

            styles.text(_);
            _._svgText({}, model.text);

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
