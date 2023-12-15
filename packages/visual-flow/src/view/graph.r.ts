import { Graph } from "../model";
import Vf from "../plugin";
import styles from "./graph.styles";

declare module "refina" {
  interface Components {
    vfGraph(model: Graph): void;
  }
}
Vf.outputComponents.vfGraph = function (_) {
  return model => {
    model.app = _.$app;

    if (_.$updateContext) {
      _.$window.addEventListener(
        "resize",
        () => {
          model.onResize();
          // not update here, because it will cause performance issue
        },
        {
          passive: true,
        },
      );
      _.$window.addEventListener(
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
      _.$window.addEventListener("mousedown", ev => {
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
      _.$window.addEventListener("mouseup", ev => {
        model.setMousePos(ev);
        if (model.onMouseUp(ev.shiftKey)) {
          ev.preventDefault();
          _.$update();
          return false;
        }
        return true;
      });
      _.$root.addEventListener(
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
  };
};
