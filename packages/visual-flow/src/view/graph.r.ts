import { OutputComponent, OutputComponentContext, outputComponent } from "refina";
import { Graph } from "../model";
import styles from "./graph.styles";

@outputComponent("vfGraph")
export class VfGraph extends OutputComponent {
  main(_: OutputComponentContext<this>, model: Graph): void {
    _.$app.registerWindowEventListener(
      "resize",
      () => {
        model.onResize();
        // not update here, because it will cause performance issue
      },
      {
        passive: true,
      },
    );
    _.$app.registerDocumentEventListener(
      "mousemove",
      (ev) => {
        model.setMousePos(ev);
        model.onMouseMove((ev.buttons & 1) !== 0);
      },
      {
        passive: true,
      },
    );
    _.$app.registerDocumentEventListener("mousedown", (ev) => {
      model.setMousePos(ev);
      if (model.onMouseDown()) {
        ev.preventDefault();
        _.$update();
        return false;
      }
      return true;
    });
    _.$app.registerDocumentEventListener("mouseup", (ev) => {
      model.setMousePos(ev);
      if (model.onMouseUp()) {
        ev.preventDefault();
        _.$update();
        return false;
      }
      return true;
    });
    _.$app.registerDocumentEventListener(
      "wheel",
      (ev) => {
        if (ev.ctrlKey) {
          if (model.onScaling(-ev.deltaY / 1500)) {
            _.$update();
          }
        }
        ev.preventDefault();
        return true;
      },
      {
        passive: false,
      },
    );

    styles.root(_);
    _.$ref(model.ref) &&
      _._div({}, (_) => {
        const { bg, fg } = model.displayLines;

        styles.bgSvg(_);
        _._svgSvg({}, () => {
          _.for(bg, "id", (line) => {
            _.vfLine(line);
          });

          const boardOriginGraphPos = model.boardPos2GraphPos({ x: 0, y: 0 });
          _._svgCircle({
            cx: boardOriginGraphPos.x,
            cy: boardOriginGraphPos.y,
            r: 10,
            fill: "red",
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
