import { OutputComponent, OutputComponentContext, byIndex, outputComponent } from "refina";
import { Block } from "../model";

@outputComponent("vfBlock")
export class VfBlock extends OutputComponent {
  main(_: OutputComponentContext<this>, model: Block): void {
    _.portal(() => {
      _.$cls`vf-block ${model.dragging ? "dragging" : ""}`;
      _.$css`position:absolute;top:${model.y}px;left:${model.x}px;width:0px;height:0px;
             overflow:visible;z-index:${model.zIndex}`;
      _.$ref(model.ref) &&
        _._div({}, (_) => {
          _.$css`position:absolute;top:0;left:0;
          width:${model.width}px;height:${model.height}px;
          overflow:visible;`;
          _._svgSvg({}, () => {
            _.$cls`vf-block-bg`;
            _._svgPath({
              d: model.path,
            });

            _.$cls`vf-block-text`;
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
