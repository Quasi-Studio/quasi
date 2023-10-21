import { d, view } from "refina";
import { graph } from "../store";
import "@refina/fluentui-icons/documentBulletList.r.ts";
import "@refina/fluentui-icons/arrowUndo.r.ts";
import "@refina/fluentui-icons/arrowRedo.r.ts";
import "@refina/fluentui-icons/resizeLarge.r.ts";

const previewMode = d(false);

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

    _.fTooltip(
      _ =>
        _.$cls`disabled:opacity-30 h-full flex items-center enabled:hover:bg-gray-300 px-2` &&
        _.button(_ => _.fiArrowUndo20Filled(), !graph.canUndo) &&
        graph.undo(),
      "Undo",
    );
    _.fTooltip(
      _ =>
        _.$cls`disabled:opacity-30 h-full flex items-center enabled:hover:bg-gray-300 px-2` &&
        _.button(_ => _.fiArrowRedo20Filled(), !graph.canRedo) &&
        graph.redo(),
      "Redo",
    );
    _.fTooltip(_ => {
      _.$cls`disabled:opacity-30 h-full flex items-center enabled:hover:bg-gray-300 px-2`;
      if (_.button(_ => _.fiResizeLarge20Filled())) {
        graph.boardOffsetX = 0;
        graph.boardOffsetY = 0;
        graph.boardScale = 1;
      }
    }, "Reset view");
  });

  _.$cls`absolute flex items-center h-full right-0`;
  _.div(_ => {
    _.span("Preview mode");
    _.fSwitch("", previewMode);
  });
});
