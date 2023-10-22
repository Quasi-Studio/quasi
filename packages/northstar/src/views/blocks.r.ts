import { byProp, view } from "refina";
import { ComponentBlock } from "../blocks/component/block";
import { graph } from "../store";
import special from "../blocks/special";
import blocks from "@quasi-dev/block-data";

export default view(_ => {
  if (_.fAccordion("Special")) {
    _.$cls`grid grid-cols-3 justify-items-center`;
    _.div(_ => {
      _.for(
        special,
        ([k]: any) => k,
        ([k, v]) => {
          _.vfCreator(
            graph,
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
  if (_.fAccordion("Components")) {
    _.$cls`grid grid-cols-3 justify-items-center`;
    _.div(_ => {
      _.for(
        blocks,
        ([k]: any) => k,
        ([k, v]) => {
          _.vfCreator(
            graph,
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
              block.initialize(k, v);
              return block;
            },
          );
        },
      );
    });
  }
  if (_.fAccordion("Views")) {
    _.$cls`grid grid-cols-3 justify-items-center`;
    _.div(_ => {
      _.forRange(6, i => {
        _.$cls`my-1`;
        _.div(_ => {
          _.img("https://via.placeholder.com/80x80?text=" + i);
          _.$cls`text-center text-sm`;
          _.div("View " + i);
        });
      });
    });
  }
});
