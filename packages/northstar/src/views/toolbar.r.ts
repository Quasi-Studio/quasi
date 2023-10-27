import "@refina/fluentui-icons/addSquareMultiple.r.ts";
import "@refina/fluentui-icons/alignLeft.r.ts";
import "@refina/fluentui-icons/alignTop.r.ts";
import "@refina/fluentui-icons/arrowRedo.r.ts";
import "@refina/fluentui-icons/arrowUndo.r.ts";
import "@refina/fluentui-icons/delete.r.ts";
import "@refina/fluentui-icons/documentBulletList.r.ts";
import "@refina/fluentui-icons/drawerArrowDownload.r.ts";
import "@refina/fluentui-icons/edit.r.ts";
import "@refina/fluentui-icons/resizeLarge.r.ts";
import { Content, d, view } from "refina";
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

export default view(_ => {
  _.$cls`flex items-center h-full`;
  _.div(_ => {
    _.$cls`font-bold text-lg px-2`;
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
      buildOutput = _.$ev ? JSON.stringify(toOutput(), undefined, 2) : "Building...";
    }

    if (!previewMode.value) {
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
        "Reset",
        _ => _.fiResizeLarge20Regular(),
        false,
        () => {
          currentGraph.boardOffsetX = 0;
          currentGraph.boardOffsetY = 0;
          currentGraph.boardScale = 1;
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
    _.span("Preview mode");
    _.fSwitch("", previewMode);
  });
});
