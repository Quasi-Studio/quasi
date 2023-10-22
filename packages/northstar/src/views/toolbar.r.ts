import "@refina/fluentui-icons/addSquareMultiple.r.ts";
import "@refina/fluentui-icons/alignLeft.r.ts";
import "@refina/fluentui-icons/alignTop.r.ts";
import "@refina/fluentui-icons/arrowRedo.r.ts";
import "@refina/fluentui-icons/arrowUndo.r.ts";
import "@refina/fluentui-icons/delete.r.ts";
import "@refina/fluentui-icons/documentBulletList.r.ts";
import "@refina/fluentui-icons/resizeLarge.r.ts";
import "@refina/fluentui-icons/drawerArrowDownload.r.ts";
import { Content, d, view } from "refina";
import { graph } from "../store";
import {
  alignBlocksToLeft,
  alignBlocksToTop,
  duplicateBlocks,
  hasBlocksToAlign,
  hasBlocksToDuplicate,
  hasBlocksToRemove,
  removeBlocks,
  saveAs,
} from "../utils";
import { toOutput } from "../utils/toOutpus";

const previewMode = d(false);

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
          _.fButton("Open");
          _.fButton("Save");
          if (_.fButton("Save as")) {
            saveAs().then(close);
          }
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
              onwheel: e => {
                e.stopPropagation();
              },
            },
            buildOutput,
          );
        },
      )
    ) {
      buildOutput = _.$ev ? JSON.stringify(toOutput(), undefined, 2) : "Building...";
    }

    _.embed(
      toolItem,
      "Undo",
      _ => _.fiArrowUndo20Filled(),
      !graph.canUndo,
      () => graph.undo(),
    );
    _.embed(
      toolItem,
      "Redo",
      _ => _.fiArrowRedo20Filled(),
      !graph.canRedo,
      () => graph.redo(),
    );
    _.embed(
      toolItem,
      "Reset",
      _ => _.fiResizeLarge20Regular(),
      false,
      () => {
        graph.boardOffsetX = 0;
        graph.boardOffsetY = 0;
        graph.boardScale = 1;
      },
    );

    _.embed(toolItem, "Duplicate", _ => _.fiAddSquareMultiple20Regular(), !hasBlocksToDuplicate(), duplicateBlocks);
    _.embed(toolItem, "Remove", _ => _.fiDelete20Regular(), !hasBlocksToRemove(), removeBlocks);

    _.embed(toolItem, "Align left", _ => _.fiAlignLeft20Regular(), !hasBlocksToAlign(), alignBlocksToLeft);
    _.embed(toolItem, "Align top", _ => _.fiAlignTop20Regular(), !hasBlocksToAlign(), alignBlocksToTop);
  });

  _.$cls`absolute flex items-center h-full right-0`;
  _.div(_ => {
    _.span("Preview mode");
    _.fSwitch("", previewMode);
  });
});
