import "@refina/fluentui-icons/arrowRedo.r.ts";
import "@refina/fluentui-icons/arrowUndo.r.ts";
import "@refina/fluentui-icons/delete.r.ts";
import "@refina/fluentui-icons/documentBulletList.r.ts";
import "@refina/fluentui-icons/resizeLarge.r.ts";
import "@refina/fluentui-icons/addSquareMultiple.r.ts";
import { Content, d, view } from "refina";
import { graph } from "../store";
import { hasBlocksToRemove, removeBlocks } from "../utils";
import { duplicateBlocks, hasBlocksToDuplicate } from "../utils/duplicateBlock";

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
      _ => {
        _.$cls`flex flex-col gap-4`;
        _.div(_ => {
          _.fButton("New");
          _.fButton("Open");
          _.fButton("Save");
          _.fButton("Save as");
        });
      },
      (_, close) => {},
    );

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
  });

  _.$cls`absolute flex items-center h-full right-0`;
  _.div(_ => {
    _.span("Preview mode");
    _.fSwitch("", previewMode);
  });
});
