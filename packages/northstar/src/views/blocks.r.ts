import { componentInfoArray } from "@quasi-dev/runtime";
import { FiEdit20Filled, FiEdit20Regular } from "@refina/fluentui-icons/edit";
import { byIndex, $view } from "refina";
import { ComponentBlock } from "../blocks/component/block";
import special from "../blocks/special";
import { ViewBlock } from "../blocks/special/view.r";
import { currentProject } from "../project";
import { app } from "../app.r";

export default $view(_ => {
  if (_.fAccordion("Special", false, true)) {
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
  if (_.fAccordion("Components", false, true)) {
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
  if (_.fAccordion("Views", false, true)) {
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
                _.div(_ => _(FiEdit20Filled)());
              } else {
                _.$cls`float-right mr-1 hover:bg-gray-300`;
                _._div(
                  {
                    onmousedown: ev => ev.stopPropagation(),
                    onclick: () => {
                      currentProject.setActiveView(id);
                      app.update();
                    },
                  },
                  _ => _(FiEdit20Regular)(),
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
            app.update();
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
