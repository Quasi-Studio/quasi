import { ComponentContext, OutputComponent, byIndex } from "refina";
import { Block } from "../model";
import Vf from "../plugin";
import styles from "./block.styles";

@Vf.outputComponent("vfBlock")
export class VfBlock extends OutputComponent {
  main(_: ComponentContext<this>, model: Block): void {
    _.portal(() => {
      const { x: pageX, y: pageY } = model.pagePos;

      styles.root(model.selected, model.attached, model.predicting)(_);
      _.$css`top:${pageY}px;left:${pageX}px;z-index:${model.attached ? model.zIndex : 10000}`;
      _.$ref(model.ref) &&
        _._div({}, (_) => {
          styles.svg(_);
          _._svgSvg({}, () => {
            styles.bg(model.selected)(_);
            _.$ref(model.bgRef) &&
              _._svgPath({
                d: model.backgroudPath,
              });

            _.for(model.allSockets, byIndex, (socket) => {
              _.vfSocket(socket);
            });
          });

          _._div(
            {
              onmousedown: (ev) => {
                ev.stopPropagation();
              },
              // onmousemove: (ev) => {
              //   if (!model.dragging) ev.stopPropagation();
              // },
              onmouseup: (ev) => {
                if (!model.selected) ev.stopPropagation();
              },
            },
            model.contentMain,
          );
        });
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    vfBlock: VfBlock;
  }
}
