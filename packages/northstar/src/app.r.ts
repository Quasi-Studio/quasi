import Vf, { Graph, RectBlock } from "@quasi-dev/visual-flow";
import Basics from "@refina/basic-components";
import FluentUI, { FUnderlineTextInput } from "@refina/fluentui";
import { app, ref } from "refina";

let graph = new Graph();

app.use(FluentUI).use(Vf).use(Basics)((_) => {
  _.$rootCls`fixed top-0 left-0 right-0 bottom-0`;

  const hasSelectedBlock = true || graph.selectedBlocks.size > 0;

  // toolbar
  _.$cls`absolute left-0 top-0 w-full h-12 bg-gray-100 flex select-none`;
  _.div(() => {
    _.$cls`flex items-center h-full px-4 font-bold text-xl`;
    _.span("Quasi Studio");
  });

  _.$cls`absolute left-0 top-12 w-80 ${hasSelectedBlock ? "bottom-[40%]" : "bottom-0"}
   bg-gray-200 select-none`;
  _.div(() => {
    _.$cls`flex items-center w-full bg-gray-300 pl-2 leading-7`;
    _.div("Blocks");

    _.$cls`overflow-y-scroll h-full`;
    _.div(() => {
      if (_.fAccordion("Special")) {
        _.$cls`flex flex-wrap justify-around`;
        _.div(() => {
          _.forRange(6, (i) => {
            _.$cls`my-1 border-2 border-transparent hover:border-gray-400`;
            _.vfCreator(
              graph,
              () => {
                _.img("https://via.placeholder.com/80x80?text=" + i);
                _.$cls`text-center text-sm`;
                _.div("Root");
              },
              () => {
                const block = new RectBlock();
                block.boardWidth = 200;
                block.boardHeight = 50;
                return block;
              },
            );
          });
        });
      }
      if (_.fAccordion("Components")) {
        _.$cls`flex flex-wrap justify-around`;
        _.div(() => {
          _.forRange(12, (i) => {
            _.$cls`my-1`;
            _.div(() => {
              _.img("https://via.placeholder.com/80x80?text=" + i);
              _.$cls`text-center text-sm overflow-hidden`;
              _.div("Text input");
            });
          });
        });
      }
      if (_.fAccordion("Views")) {
        _.$cls`flex flex-wrap justify-around`;
        _.div(() => {
          _.forRange(6, (i) => {
            _.$cls`my-1`;
            _.div(() => {
              _.img("https://via.placeholder.com/80x80?text=" + i);
              _.$cls`text-center text-sm`;
              _.div("View " + i);
            });
          });
        });
      }
    });
  });

  if (hasSelectedBlock) {
    _.$cls`absolute left-0 bottom-0 w-80 h-2/5 border-t-4 border-gray-400`;
    _.div(() => {
      _.$cls`flex items-center w-full bg-gray-300 pl-2 leading-7`;
      _.div("Properties");

      _.$cls`overflow-y-scroll h-full bg-gray-200 grid grid-cols-5`;
      _.div(() => {
        _.forRange(15, (i) => {
          const r = ref<FUnderlineTextInput>();
          _.$cls`col-span-1 flex justify-center items-center border-b border-gray-500 cursor-text`;
          _._div(
            {
              onclick: () => {
                (r.current!.$mainEl?.firstChild! as HTMLInputElement).focus();
              },
            },
            i,
          );
          _.$cls`col-span-4 cursor-text`;
          _.$ref(r) && _.fUnderlineTextInput("Text input " + i);
        });
      });
    });
  }

  _.$cls`absolute left-80 top-12 right-0 bottom-0 border-l border-gray-400`;
  _._div({}, () => _.vfGraph(graph));
});
