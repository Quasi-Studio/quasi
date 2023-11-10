import blocks from "@quasi-dev/block-data";
import "@refina/fluentui-icons/edit.r.ts";
import { bySelf, view } from "refina";
import { ComponentBlock } from "../blocks/component/block";
import special from "../blocks/special";
import { ViewBlock } from "../blocks/special/view.r";
import { createNewView, currentGraph, currentViewId, setCurrentView, views } from "../store";

export default view(_ => {
  if (_.fAccordionDefaultOpen("Special")) {
    _.$cls`grid grid-cols-3 justify-items-center`;
    _.div(_ => {
      _.for(
        special,
        ([k]: any) => k,
        ([k, v]) => {
          _.$cls`cursor-pointer`;
          _.vfCreator(
            currentGraph,
            _ => {
              _.$cls`my-1`;
              _.div(_ => {
                _.img("https://via.placeholder.com/80x80?text=" + k);
                _.$cls`text-center text-sm overflow-hidden`;
                _.div(k);
              });
            },
            () => {
              const block = new v();
              return block;
            },
          );
        },
      );
    });
  }
  if (_.fAccordionDefaultOpen("Components")) {
    _.$cls`grid grid-cols-3 justify-items-center`;
    _.div(_ => {
      _.for(
        blocks,
        ([k]: any) => k,
        ([k, v]) => {
          _.$cls`cursor-pointer`;
          _.vfCreator(
            currentGraph,
            _ => {
              _.$cls`my-1`;
              _.div(_ => {
                _.img("https://via.placeholder.com/80x80?text=" + k);
                _.$cls`text-center text-sm overflow-hidden`;
                _.div(v.name);
              });
            },
            () => {
              const block = new ComponentBlock();
              block.setComponentType(k, v);
              return block;
            },
          );
        },
      );
    });
  }
  if (_.fAccordionDefaultOpen("Views")) {
    _.$cls`grid grid-cols-3 justify-items-center`;
    _.div(_ => {
      _.for(views.keys(), bySelf, id => {
        const editingThis = id === currentViewId;

        _.$cls`my-1 cursor-pointer`;
        _.vfCreator(
          currentGraph,
          _ => {
            _.img("https://via.placeholder.com/80x80?text=" + id);
            _.$cls`text-center text-sm flex-nowrap`;
            _.div(_ => {
              _.span(id);
              if (editingThis) {
                _.$cls`float-right mr-1 text-gray-500`;
                _.div(_ => _.fiEdit20Filled());
              } else {
                _.$cls`float-right mr-1 hover:bg-gray-300`;
                _._div(
                  {
                    onmousedown: ev => ev.stopPropagation(),
                    onclick: () => {
                      setCurrentView(id);
                      _.$update();
                    },
                  },
                  _ => _.fiEdit20Regular(),
                );
              }
            });
          },
          () => {
            const block = new ViewBlock();
            block.viewName = id;
            return block;
          },
          id === "app" || editingThis,
        );
      });
      _.$cls`my-1 hover:border-2 hover:border-gray-400 cursor-pointer`;
      _._div(
        {
          onclick: () => {
            const id = createNewView();
            setCurrentView(id);
            _.$update();
          },
        },
        _ => {
          _.img("https://via.placeholder.com/80x80?text=%2B");
          _.$cls`w-full text-center text-sm flex-nowrap`;
          _.div("New View");
        },
      );
    });
  }
});
