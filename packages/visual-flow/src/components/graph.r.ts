import { OutputComponent, OutputComponentContext, outputComponent } from "refina";
import { Graph } from "../model";
import { getPagePos } from "../utils";
import styles from "./graph.styles";

@outputComponent("vfGraph")
export class VfGraph extends OutputComponent {
  main(_: OutputComponentContext<this>, model: Graph): void {
    _.$app.registerWindowEventListener("resize", () => {
      model.onResize();
      // not update here, because it will cause performance issue
    });
    _.$app.registerDocumentEventListener("mousemove", (e) => {
      model.onMouseMove(getPagePos(e)) && e.preventDefault();
      // not update here, because it will cause performance issue
    });
    _.$app.registerDocumentEventListener("mousedown", (e) => {
      model.onMouseDown(getPagePos(e)) && e.preventDefault();
      _.$update();
    });
    _.$app.registerDocumentEventListener("mouseup", (e) => {
      model.onMouseUp(getPagePos(e)) && e.preventDefault();
      _.$update();
    });

    styles.root(_);
    _.$ref(model.ref) &&
      _._div({}, (_) => {
        const { bg, fg } = model.displayLines;

        styles.bgSvg(_);
        _._svgSvg({}, () => {
          _.for(bg, "id", (line) => {
            _.vfLine(line);
          });
        });

        styles.fgSvg(_);
        _._svgSvg({}, () => {
          _.for(fg, "id", (line) => {
            _.vfLine(line);
          });
        });
      });
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
