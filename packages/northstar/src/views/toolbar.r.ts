import { Compiler } from "@quasi-dev/compiler";
import {
  FFieldValidationState,
  FProgressBarColor,
  FProgressBarValue,
} from "@refina/fluentui";
import { FiAddSquareMultiple20Regular } from "@refina/fluentui-icons/addSquareMultiple";
import { FiAlignLeft20Regular } from "@refina/fluentui-icons/alignLeft";
import { FiAlignTop20Regular } from "@refina/fluentui-icons/alignTop";
import { FiArrowRedo20Filled } from "@refina/fluentui-icons/arrowRedo";
import { FiArrowUndo20Filled } from "@refina/fluentui-icons/arrowUndo";
import { FiDelete20Regular } from "@refina/fluentui-icons/delete";
import { FiDocumentBulletList20Regular } from "@refina/fluentui-icons/documentBulletList";
import { FiDrawerArrowDownload20Regular } from "@refina/fluentui-icons/drawerArrowDownload";
import { FiImageBorder20Regular } from "@refina/fluentui-icons/imageBorder";
import { FiResizeLarge20Regular } from "@refina/fluentui-icons/resizeLarge";
import { FiResizeSmall20Regular } from "@refina/fluentui-icons/resizeSmall";
import { domToBlob } from "modern-screenshot";
import {
  $view,
  Component,
  Content,
  HTMLElementComponent,
  _,
  model,
  propModel,
  ref,
} from "refina";
import { app } from "../app.r";
import {
  Project,
  currentProject,
  openFile,
  saveAs,
  setCurrentProject,
} from "../project";
import {
  alignBlocksToLeft,
  alignBlocksToTop,
  duplicateBlocks,
  hasBlocksToAlign,
  hasBlocksToDuplicate,
  hasBlocksToRemove,
  removeBlocks,
} from "../utils";
import { startPreview } from "./preview.r";
import iconURL from "/favicon.ico?url";

export const previewMode = model(false);

class ToolItem extends Component {
  $main(
    tip: string,
    buttonContent: Content,
    disabled: boolean,
    callback: () => void,
  ) {
    _.fTooltip(
      _ =>
        _.$cls`disabled:opacity-30 h-full flex items-center enabled:hover:bg-gray-300 px-2` &&
        _.button(buttonContent, disabled) &&
        callback(),
      tip,
    );
  }
}

let buildOutput = "";

let exportToPNGProgess: FProgressBarValue = 0;
let exportToPNGColor: FProgressBarColor = "brand";
let exportToPNGValidationState: FFieldValidationState = "none";
let exportToPNGMessage = `Click the "Export" button above to start`;

export const graphElRef = ref<HTMLElementComponent<"div">>();

export default $view(_ => {
  _.$cls`flex items-center h-full`;
  _.div(_ => {
    _.$cls`w-[2em] h-[2em] invert`;
    _._img({ src: iconURL });

    _.$cls`font-bold text-lg pr-2`;
    _.span("Quasi Studio");

    _.fDialog(
      open => {
        _.fTooltip(
          _ =>
            _.$cls`h-full flex items-center hover:bg-gray-300 px-2` &&
            _.button(_ => _(FiDocumentBulletList20Regular)()) &&
            open(),
          "File",
        );
      },
      "File",
      close => {
        _.$cls`flex flex-col gap-4`;
        _.div(_ => {
          _.fButton("New") && (setCurrentProject(Project.new()), close());
          _.fButton("Open") && openFile().then(close);
          // _.fButton("Save");
          _.fButton("Save as") && saveAs().then(close);
        });
      },
    );

    if (
      _.fDialog(
        open => {
          _.fTooltip(
            _ =>
              _.$cls`h-full flex items-center hover:bg-gray-300 px-2` &&
              _.button(_ => _(FiDrawerArrowDownload20Regular)()) &&
              open(),
            "Build",
          );
        },
        "Build",
        close => {
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
          const compiler = new Compiler(currentProject.toOutput());
          compiler
            .compile()
            .then(v => {
              buildOutput = v;
              app.update();
            })
            .catch(err => {
              buildOutput = `Compile ${err}`;
              app.update();
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
        open =>
          _(ToolItem)(
            "Export to PNG",
            _ => _(FiImageBorder20Regular)(),
            currentProject.activeGraph.blocks.length === 0,
            open,
          ),
        "Export to PNG",
        close => {
          _.$cls`mb-5`;
          _._div();

          if (_.fPrimaryButton("Export", exportToPNGProgess !== 0)) {
            exportToPNGMessage = "Generating...";

            const node = graphElRef.current!.node;

            const { boardOffsetX, boardOffsetY, boardScale } =
              currentProject.activeGraph;
            const restoreBoard = () => {
              currentProject.activeGraph.boardOffsetX = boardOffsetX;
              currentProject.activeGraph.boardOffsetY = boardOffsetY;
              currentProject.activeGraph.boardScale = boardScale;
            };
            const { width, height } = currentProject.activeGraph.fullView();
            currentProject.activeGraph.updatePosition();

            setTimeout(() => {
              const { x, y } = node.getBoundingClientRect();

              domToBlob(node, {
                backgroundColor: "white",
                scale: 4 / currentProject.activeGraph.boardScale,
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
                  app.update();

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
                  app.update();

                  await writable.write(await blob.arrayBuffer());
                  exportToPNGProgess = 0.9;
                  app.update();

                  await writable.close();
                  exportToPNGProgess = 1;
                  exportToPNGMessage = "Done";
                  exportToPNGValidationState = "success";

                  app.update();

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
                  app.update();
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

      _(ToolItem)(
        "Undo",
        _ => _(FiArrowUndo20Filled)(),
        !currentProject.activeGraph.canUndo,
        () => currentProject.activeGraph.undo(),
      );
      _(ToolItem)(
        "Redo",
        _ => _(FiArrowRedo20Filled)(),
        !currentProject.activeGraph.canRedo,
        () => currentProject.activeGraph.redo(),
      );
      _(ToolItem)(
        "Reset viewport",
        _ => _(FiResizeLarge20Regular)(),
        false,
        () => {
          currentProject.activeGraph.resetViewport();
          currentProject.activeGraph.pushRecord();
        },
      );
      _(ToolItem)(
        "Full view",
        _ => _(FiResizeSmall20Regular)(),
        false,
        () => {
          currentProject.activeGraph.fullView();
          currentProject.activeGraph.pushRecord();
        },
      );

      _(ToolItem)(
        "Duplicate",
        _ => _(FiAddSquareMultiple20Regular)(),
        !hasBlocksToDuplicate(),
        duplicateBlocks,
      );
      _(ToolItem)(
        "Remove",
        _ => _(FiDelete20Regular)(),
        !hasBlocksToRemove(),
        removeBlocks,
      );

      _(ToolItem)(
        "Align left",
        _ => _(FiAlignLeft20Regular)(),
        !hasBlocksToAlign(),
        alignBlocksToLeft,
      );
      _(ToolItem)(
        "Align top",
        _ => _(FiAlignTop20Regular)(),
        !hasBlocksToAlign(),
        alignBlocksToTop,
      );
    }
  });

  _.$cls`flex font-[Consolas] absolute left-1/2 h-full items-center`;
  _.div(
    previewMode.value
      ? "Preview App"
      : _ => {
          _.span("Graph:");
          if (currentProject.activeViewId === 0) {
            _.$cls`ml-1`;
            _.span("app");
          } else {
            _._span(
              {
                onkeydown: ev => ev.stopPropagation(),
              },
              _ =>
                _.fUnderlineInput(propModel(currentProject.activeView, "name")),
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
