import { Compiler } from "@quasi-dev/compiler";
import { FieldValidationState, ProgressBarColor, ProgressBarValue } from "@refina/fluentui";
import "@refina/fluentui-icons/addSquareMultiple.r.ts";
import "@refina/fluentui-icons/alignLeft.r.ts";
import "@refina/fluentui-icons/alignTop.r.ts";
import "@refina/fluentui-icons/arrowRedo.r.ts";
import "@refina/fluentui-icons/arrowUndo.r.ts";
import "@refina/fluentui-icons/delete.r.ts";
import "@refina/fluentui-icons/documentBulletList.r.ts";
import "@refina/fluentui-icons/drawerArrowDownload.r.ts";
import "@refina/fluentui-icons/edit.r.ts";
import "@refina/fluentui-icons/imageBorder.r.ts";
import "@refina/fluentui-icons/resizeLarge.r.ts";
import "@refina/fluentui-icons/resizeSmall.r.ts";
import { domToBlob } from "modern-screenshot";
import { Content, HTMLElementComponent, d, ref, view } from "refina";
import iconURL from "../../public/favicon.ico";
import { currentGraph, currentViewId, setCurrentViewId } from "../store";
import {
  alignBlocksToLeft,
  alignBlocksToTop,
  duplicateBlocks,
  hasBlocksToAlign,
  hasBlocksToDuplicate,
  hasBlocksToRemove,
  open,
  removeBlocks,
  saveAs,
} from "../utils";
import { toOutput } from "../utils/toOutpus";
import { startPreview } from "./preview.r";

export const previewMode = d(false);

const toolItem = view((_, tip: string, buttonContent: Content, disabled: boolean, callback: () => void) => {
  _.fTooltip(
    _ =>
      _.$cls`disabled:opacity-30 h-full flex items-center enabled:hover:bg-gray-300 px-2` &&
      _.button(buttonContent, disabled) &&
      callback(),
    tip,
  );
});

let buildOutput = "";

let exportToPNGProgess: ProgressBarValue = 0;
let exportToPNGColor: ProgressBarColor = "brand";
let exportToPNGValidationState: FieldValidationState = "none";
let exportToPNGMessage = `Click the "Export" button above to start`;

export const graphElRef = ref<HTMLElementComponent<"div">>();

export default view(_ => {
  _.$cls`flex items-center h-full`;
  _.div(_ => {
    _.$cls`w-[2em] h-[2em] invert`;
    _._img({ src: iconURL });

    _.$cls`font-bold text-lg pr-2`;
    _.span("Quasi Studio");

    _.fDialog(
      (_, open) => {
        _.fTooltip(
          _ =>
            _.$cls`h-full flex items-center hover:bg-gray-300 px-2` &&
            _.button(_ => _.fiDocumentBulletList20Regular()) &&
            open(),
          "File",
        );
      },
      "File",
      (_, close) => {
        _.$cls`flex flex-col gap-4`;
        _.div(_ => {
          _.fButton("New");
          _.fButton("Open") && open().then(close);
          _.fButton("Save");
          _.fButton("Save as") && saveAs().then(close);
        });
      },
    );

    if (
      _.fDialog(
        (_, open) => {
          _.fTooltip(
            _ =>
              _.$cls`h-full flex items-center hover:bg-gray-300 px-2` &&
              _.button(_ => _.fiDrawerArrowDownload20Regular()) &&
              open(),
            "Build",
          );
        },
        "Build",
        (_, close) => {
          _.$cls`block h-56 w-full border-2 overflow-y-scroll rounded shadow-inner border-gray-400 p-3 font-[Consolas]`;
          _._textarea(
            {
              onwheel: e => e.stopPropagation(),
              onmousedown: e => e.stopPropagation(),
              onmousemove: e => e.stopPropagation(),
              onmouseup: e => e.stopPropagation(),
              onkeydown: e => e.stopPropagation(),
            },
            buildOutput,
          );
        },
      )
    ) {
      if (_.$ev) {
        try {
          const compiler = new Compiler(toOutput());
          compiler
            .compile()
            .then(v => {
              buildOutput = v;
              _.$update();
            })
            .catch(err => {
              buildOutput = `Compile ${err}`;
              _.$update();
            });
        } catch (e) {
          buildOutput = `${e}`;
          console.error(e);
        }
      } else {
        buildOutput = "Building...";
      }
    }

    if (!previewMode.value) {
      _.fDialog(
        (_, open) =>
          _.embed(toolItem, "Export to PNG", _ => _.fiImageBorder20Regular(), currentGraph.blocks.length === 0, open),
        "Export to PNG",
        (_, close) => {
          _.$cls`mb-5`;
          _._div();

          if (_.fPrimaryButton("Export", exportToPNGProgess !== 0)) {
            exportToPNGMessage = "Generating...";

            const node = graphElRef.current!.node;

            const { boardOffsetX, boardOffsetY, boardScale } = currentGraph;
            const restoreBoard = () => {
              currentGraph.boardOffsetX = boardOffsetX;
              currentGraph.boardOffsetY = boardOffsetY;
              currentGraph.boardScale = boardScale;
            };
            const { width, height } = currentGraph.fullView();
            currentGraph.updatePosition();

            setTimeout(() => {
              const { x, y } = node.getBoundingClientRect();

              domToBlob(node, {
                backgroundColor: "white",
                scale: 4 / currentGraph.boardScale,
                width: width,
                height: height,
                style: {
                  transform: `translate(-${x}px, -${y}px)`,
                },
                filter: node => (node as Element).id !== "vf-thumbnail",
                timeout: 30000,
              })
                .then(async blob => {
                  exportToPNGProgess = 0.7;
                  exportToPNGMessage = "Saving...";
                  _.$update();

                  const handle = await window.showSaveFilePicker({
                    suggestedName: "quasi-graph.png",
                    types: [
                      {
                        description: "PNG",
                        accept: {
                          "image/png": [".png"],
                        },
                      },
                    ],
                  });

                  const writable = await handle.createWritable();
                  exportToPNGProgess = 0.8;
                  _.$update();

                  await writable.write(await blob.arrayBuffer());
                  exportToPNGProgess = 0.9;
                  _.$update();

                  await writable.close();
                  exportToPNGProgess = 1;
                  exportToPNGMessage = "Done";
                  exportToPNGValidationState = "success";

                  _.$update();

                  await new Promise(resolve => setTimeout(resolve, 500));
                  close();
                })
                .catch(err => {
                  if (err instanceof Error && err.name === "AbortError") {
                    close();
                    return;
                  }
                  exportToPNGProgess = 0;
                  exportToPNGColor = "success";
                  exportToPNGColor = "error";
                  exportToPNGMessage = `${err}`;
                  exportToPNGValidationState = "error";
                  _.$update();
                })
                .finally(() => {
                  restoreBoard();
                  exportToPNGProgess = 0;
                  exportToPNGColor = "brand";
                  exportToPNGValidationState = "none";
                  exportToPNGMessage = `Click the "Export" button above to start`;
                });
            }, 100);
          }
          _.$cls`mt-5`;
          _.fField(
            _ => _.fProgressBar(exportToPNGProgess, exportToPNGColor),
            "Progess",
            false,
            exportToPNGValidationState,
            exportToPNGMessage,
          );
        },
      );

      _.embed(
        toolItem,
        "Undo",
        _ => _.fiArrowUndo20Filled(),
        !currentGraph.canUndo,
        () => currentGraph.undo(),
      );
      _.embed(
        toolItem,
        "Redo",
        _ => _.fiArrowRedo20Filled(),
        !currentGraph.canRedo,
        () => currentGraph.redo(),
      );
      _.embed(
        toolItem,
        "Reset viewport",
        _ => _.fiResizeLarge20Regular(),
        false,
        () => {
          currentGraph.resetViewport();
          currentGraph.pushRecord();
        },
      );
      _.embed(
        toolItem,
        "Full view",
        _ => _.fiResizeSmall20Regular(),
        false,
        () => {
          currentGraph.fullView();
          currentGraph.pushRecord();
        },
      );

      _.embed(toolItem, "Duplicate", _ => _.fiAddSquareMultiple20Regular(), !hasBlocksToDuplicate(), duplicateBlocks);
      _.embed(toolItem, "Remove", _ => _.fiDelete20Regular(), !hasBlocksToRemove(), removeBlocks);

      _.embed(toolItem, "Align left", _ => _.fiAlignLeft20Regular(), !hasBlocksToAlign(), alignBlocksToLeft);
      _.embed(toolItem, "Align top", _ => _.fiAlignTop20Regular(), !hasBlocksToAlign(), alignBlocksToTop);
    }
  });

  _.$cls`flex font-[Consolas] absolute left-1/2 h-full items-center`;
  _.div(
    previewMode.value
      ? "Preview App"
      : _ => {
          _.span("Graph:");
          if (currentViewId === "app") {
            _.$cls`ml-1`;
            _.span("app");
          } else {
            _._span(
              {
                onkeydown: ev => ev.stopPropagation(),
              },
              _ => _.fUnderlineTextInput(currentViewId) && setCurrentViewId(_.$ev),
            );
          }
        },
  );

  _.$cls`absolute flex items-center h-full right-0`;
  _.div(_ => {
    _.span("Preview");
    if (_.fSwitch("", previewMode)) {
      if (_.$ev) {
        startPreview();
      }
    }
  });
});
