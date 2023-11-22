import { componentInfoArray } from "@quasi-dev/runtime";
import "@refina/fluentui-icons/edit.r.ts";
import { byIndex, bySelf, view } from "refina";
import { ComponentBlock } from "../blocks/component/block";
import special from "../blocks/special";
import { ViewBlock } from "../blocks/special/view.r";
import { currentProject } from "../project";

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
            currentProject.activeGraph,
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
        componentInfoArray,
        ([k]: any) => k,
        ([k, v]) => {
          _.$cls`cursor-pointer`;
          _.vfCreator(
            currentProject.activeGraph,
            _ => {
              _.$cls`my-1`;
              _.div(_ => {
                _.img("https://via.placeholder.com/80x80?text=" + k);
                _.$cls`text-center text-sm overflow-hidden`;
                _.div(v.displayName({}));
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
      _.for(currentProject.views, byIndex, (view, id) => {
        if (view === null) return;

        const editingThis = id === currentProject.activeViewId;

        _.$cls`my-1 cursor-pointer`;
        _.vfCreator(
          currentProject.activeGraph,
          _ => {
            _.img("https://via.placeholder.com/80x80?text=" + view.name);
            _.$cls`text-center text-sm flex-nowrap`;
            _.div(_ => {
              _.span(view.name);
              if (editingThis) {
                _.$cls`float-right mr-1 text-gray-500`;
                _.div(_ => _.fiEdit20Filled());
              } else {
                _.$cls`float-right mr-1 hover:bg-gray-300`;
                _._div(
                  {
                    onmousedown: ev => ev.stopPropagation(),
                    onclick: () => {
                      currentProject.setActiveView(id);
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
            block.viewName = view.name;
            return block;
          },
          id === 0 || editingThis,
        );
      });
      _.$cls`my-1 hover:border-2 hover:border-gray-400 cursor-pointer`;
      _._div(
        {
          onclick: () => {
            const id = currentProject.addView();
            currentProject.setActiveView(id);
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
