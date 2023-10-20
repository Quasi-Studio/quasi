import Vf from "@quasi-dev/visual-flow";
import Basics from "@refina/basic-components";
import FluentUI from "@refina/fluentui";
import { app } from "refina";
import { graph } from "./store";
import blocksView from "./views/blocks.r";
import propertiesView from "./views/properties.r";
import toolbarView from "./views/toolbar.r";

app.use(FluentUI).use(Vf).use(Basics)(_ => {
  _.$rootCls`fixed top-0 left-0 right-0 bottom-0`;

  const hasSelectedBlock = [...graph.selectedBlocks].filter(block => !block.pendingClick).length > 0;

  // toolbar
  _.$cls`absolute left-0 top-0 w-full h-8 bg-gray-100 flex select-none z-[1000]`;
  _.div(toolbarView);

  _.$cls`absolute left-0 top-8 w-80 ${hasSelectedBlock ? "bottom-[40%]" : "bottom-0"}
   bg-gray-200 select-none z-[1000] border-r border-gray-400`;
  _.div(() => {
    _.$cls`flex items-center w-full bg-gray-300 pl-2 leading-7`;
    _.div("Blocks");

    _.$cls`overflow-y-scroll h-full`;
    _.div(() => _.embed(blocksView));
  });

  if (hasSelectedBlock) {
    _.$cls`absolute left-0 bottom-0 w-80 h-2/5 border-t-4 border-gray-400 border-r border-gray-400 z-[1000]`;
    _.div(() => {
      _.$cls`flex items-center w-full bg-gray-300 pl-2 leading-7`;
      _.div(() => {
        _.t`Properties`;

        _.$cls`text-xs pl-3`;
        _.span([...graph.selectedBlocks].map(b => b.name).join(" "));
      });

      _.$cls`overflow-y-scroll h-full bg-gray-200 grid grid-cols-5`;
      _.div(() => _.embed(propertiesView));
    });
  }

  _.$cls`absolute left-80 top-8 right-0 bottom-0`;
  _._div({}, () => _.vfGraph(graph));
});
