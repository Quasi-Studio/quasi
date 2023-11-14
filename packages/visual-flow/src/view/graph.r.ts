import { ComponentContext, OutputComponent } from "refina";
import { Graph } from "../model";
import Vf from "../plugin";
import styles from "./graph.styles";

@Vf.outputComponent("vfGraph")
export class VfGraph extends OutputComponent {
  main(_: ComponentContext, model: Graph): void {
    model.app = _.$app;
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
      ev => {
        model.setMousePos(ev);
        if (model.onMouseMove((ev.buttons & 1) !== 0, ev.shiftKey)) {
          window.getSelection()?.removeAllRanges();
          _.$update();
        }
      },
      {
        passive: true,
      },
    );
    _.$app.registerDocumentEventListener("mousedown", ev => {
      model.setMousePos(ev);
      if (model.onMouseDown(ev.shiftKey)) {
        window.getSelection()?.removeAllRanges();
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement?.blur();
        }
        ev.preventDefault();
        _.$update();
        return false;
      }
      return true;
    });
    _.$app.registerDocumentEventListener("mouseup", ev => {
      model.setMousePos(ev);
      if (model.onMouseUp(ev.shiftKey)) {
        ev.preventDefault();
        _.$update();
        return false;
      }
      return true;
    });
    _.$app.registerRootEventListener(
      "wheel",
      ev => {
        model.setMousePos(ev);
        if (!model.isMouseInsideGraph) {
          return;
        }
        if (ev.ctrlKey) {
          if (model.onScaling(-ev.deltaY / 1500)) {
            ev.preventDefault();
            _.$update();
          }
        } else if (ev.shiftKey) {
          if (model.onHorizontalScroll(ev.deltaY / 2)) {
            ev.preventDefault();
            _.$update();
          }
        } else {
          if (model.onVerticalScroll(ev.deltaY / 2)) {
            ev.preventDefault();
            _.$update();
          }
        }
        return true;
      },
      {
        passive: false,
      },
    );

    if (_.$updating) {
      model.blocks.forEach(block => block.updateSockets());
    }

    styles.root(_);
    _.$ref(model.ref) &&
      _._div({}, _ => {
        const { bg, fg } = model.displayLines;

        styles.bgSvg(_);
        _._svgSvg({}, _ => {
          _.for(bg, "id", line => {
            _.vfLine(line);
          });
        });

        styles.fgSvg(_);
        _._svgSvg({}, _ => {
          _.for(fg, "id", line => {
            _.vfLine(line);
          });
        });
      });

    _.for(model.blocks, "id", block => {
      _.vfBlock(block);
    });

    styles.canvas(_);
    _.$ref(model.canvasRef) &&
      _._canvas({
        id: "vf-thumbnail",
      });
  }
}

declare module "refina" {
  interface OutputComponents {
    vfGraph: VfGraph;
  }
}
