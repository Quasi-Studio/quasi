import { d, view } from "refina";
import { graph } from "../store";
import "@refina/fluentui-icons/documentBulletList.r.ts";
import "@refina/fluentui-icons/arrowUndo.r.ts";
import "@refina/fluentui-icons/arrowRedo.r.ts";

const previewMode = d(false);

export default view(_ => {
  _.$cls`flex items-center h-full`;
  _.div(() => {
    _.$cls`font-bold text-xl px-2`;
    _.span("Quasi Studio");

    _.fDialog(
      (_, open) => {
        _.$cls`h-full flex items-center hover:bg-gray-300 px-2`;
        _.button(() => _.fiDocumentBulletList20Regular()) && open();
      },
      "File",
      _ => {
        _.$cls`flex flex-col gap-4`;
        _.div(() => {
          _.fButton("New");
          _.fButton("Open");
          _.fButton("Save");
          _.fButton("Save as");
        });
      },
      (_, close) => {},
    );

    console.warn(graph.canUndo, graph.canRedo);
    _.$cls`disabled:opacity-30 enabled:hover:bg-gray-300 px-2`;
    _.button(() => _.fiArrowUndo20Filled(), !graph.canUndo) && graph.undo();
    _.$cls`disabled:opacity-30 enabled:hover:bg-gray-300 px-2`;
    _.button(() => _.fiArrowRedo20Filled(), !graph.canRedo) && graph.redo();
  });

  _.$cls`absolute flex items-center h-full right-0 pr-4`;
  _.div(() => {
    _.span("Preview mode");
    _.fSwitch("", previewMode);

    if (_.fButton("Reset graph")) {
      graph.boardOffsetX = 0;
      graph.boardOffsetY = 0;
      graph.boardScale = 1;
    }
  });
});
