import Vf from "@quasi-dev/visual-flow";
import Basics from "@refina/basic-components";
import FluentUI from "@refina/fluentui";
import { app } from "refina";
import { currentGraph } from "./store";
import blocksView from "./views/blocks.r";
import propertiesView from "./views/properties.r";
import toolbarView, { previewMode } from "./views/toolbar.r";
import { isComponentBlock } from "./blocks/component/block";
import { duplicateBlocks, hasBlocksToDuplicate, hasBlocksToRemove, removeBlocks } from "./utils";
import previewView from "./views/preview.r";

document.body.spellcheck = false;

app.use(FluentUI).use(Vf).use(Basics)(_ => {
  _.$rootCls`fixed top-0 left-0 right-0 bottom-0`;

  _.documentTitle("Quasi Studio");

  // toolbar
  _.$cls`absolute left-0 top-0 w-full h-8 bg-gray-100 flex select-none z-[1000] border-gray-400 border-b`;
  _.div(toolbarView);

  if (previewMode.value) {
    _.$cls`absolute left-0 bottom-0 right-0 top-8 ${previewMode.value ? "" : "hidden"}`;
    _.div(previewView);
  }

  if (!previewMode.value)
    _.div(_ => {
      const hasSelectedBlock = [...currentGraph.selectedBlocks].filter(block => !block.pendingClick).length > 0;

      _.$cls`absolute left-0 top-8 w-80 ${hasSelectedBlock ? "bottom-[40%]" : "bottom-0"}
   bg-gray-200 select-none z-[1000] border-r border-gray-400`;
      _.div(_ => {
        _.$cls`flex items-center w-full bg-gray-300 pl-2 leading-7`;
        _.div("Blocks");

        _.$cls`overflow-y-scroll h-full pb-16`;
        _.div(_ => _.embed(blocksView));
      });

      if (hasSelectedBlock) {
        _.$cls`absolute left-0 bottom-0 w-80 h-2/5 border-t-4 border-gray-400 border-r border-gray-400 z-[1000]`;
        _.div(_ => {
          _.$cls`flex items-center w-full bg-gray-300 pl-2 leading-7`;
          _.div(_ => {
            _.t`Properties`;

            // _.$cls`text-xs pl-3`;
            // _.span(
            //   [...currentGraph.selectedBlocks]
            //     .filter(isComponentBlock)
            //     .map(b => b.info.name)
            //     .join(" "),
            // );
          });

          _.$cls`overflow-y-scroll h-full bg-gray-200 grid grid-cols-5`;
          _.div(_ => _.embed(propertiesView));
        });
      }

      _.$cls`absolute left-80 top-8 right-0 bottom-0`;
      _._div({}, _ => _.vfGraph(currentGraph));

      _.$app.registerDocumentEventListener("keydown", ev => {
        if (ev.ctrlKey) {
          if (ev.key === "z" && currentGraph.canUndo) {
            currentGraph.undo();
            _.$update();
          } else if (ev.key === "y" && currentGraph.canRedo) {
            currentGraph.redo();
            _.$update();
          } else if (ev.key === "s") {
            // save
          } else if (ev.key === "d" && hasBlocksToDuplicate()) {
            duplicateBlocks();
            _.$update();
          }
          ev.preventDefault();
        } else if (ev.key === "Delete") {
          if (hasBlocksToRemove()) {
            removeBlocks();
            _.$update();
          }
          ev.preventDefault();
        }
      });

      // a workaround to update the position of the graph
      setTimeout(() => currentGraph.updatePosition());
    });
});
