import { OutputComponent, OutputComponentContext, byIndex, byProp, outputComponent } from "refina";
import { Graph } from "../model";
import { getClientPos } from "../utils";

@outputComponent("vfGraph")
export class VfGraph extends OutputComponent {
  main(_: OutputComponentContext<this>, model: Graph): void {
    _.$app.registerDocumentEventListener("mousemove", (e) => {
      model.onMouseMove(getClientPos(e));
      // not update here, because it will cause performance issue
    });
    _.$app.registerDocumentEventListener("mousedown", (e) => {
      model.onMouseDown(getClientPos(e));
      _.$update();
    });
    _.$app.registerDocumentEventListener("mouseup", (e) => {
      model.onMouseUp(getClientPos(e));
      _.$update();
    });

    _.$cls`vf-graph`;
    _.$ref(model.ref) &&
      _._div({}, (_) =>
        _._svgSvg(
          {
            width: "100%",
            height: "100%",
          },
          () => {
            _.for(model.lines, "id", (line) => {
              _.vfLine(line);
            });
          },
        ),
      );
    _.for(model.blocks, "id", (block) => {
      _.vfBlock(block);
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    vfGraph: VfGraph;
  }
}
