import { ComponentContext, OutputComponent } from "refina";
import { Block } from "../model";
import Vf from "../plugin";
import styles, { PADDING_FOR_SOCKETS } from "./block.styles";

@Vf.outputComponent("vfBlock")
export class VfBlock extends OutputComponent {
  main(_: ComponentContext, model: Block): void {
    const { x, y } = model.attached ? model.graphPos : model.pagePos;
    const padding = PADDING_FOR_SOCKETS * model.graph.boardScale;

    styles.root(model.selected, model.attached, model.predicting)(_);
    _.$css`left:${x}px;top:${y}px;z-index:${
      model.attached ? model.zIndex : 10000
    }`;
    _.$ref(model.ref) &&
      _._div({}, _ => {
        styles.svg(_);
        _.$css`left:${-padding}px; top:${-padding}px`;
        _._svgSvg(
          {
            width:
              model.boundingRectBoardWidth * model.graph.boardScale +
              2 * padding,
            height:
              model.boundingRectBoardHeight * model.graph.boardScale +
              2 * padding,
          },
          _ => {
            _._svgG(
              {
                transform: `translate(${padding}, ${padding})`,
              },
              _ => {
                styles.bg(model.selected)(_);
                _.$ref(model.bgRef) &&
                  _._svgPath({
                    d: model.backgroudPath,
                  });

                _.for(model.allSockets, "id", socket => {
                  _.vfSocket(socket);
                });
              },
            );
          },
        );

        _._div(
          {
            onmousedown: ev => {
              if (ev.defaultPrevented) ev.stopPropagation();
            },
            // onmousemove: (ev) => {
            //   if (!model.dragging) ev.stopPropagation();
            // },
            onmouseup: ev => {
              if (!model.selected) ev.stopPropagation();
            },
          },
          model.contentMain,
        );
      });
  }
}

declare module "refina" {
  interface OutputComponents {
    vfBlock: VfBlock;
  }
}
