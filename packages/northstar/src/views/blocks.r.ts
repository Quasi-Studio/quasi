import {
  Direction,
  InSocket,
  MultiOutSocket,
  PATH_IN_RECT,
  PATH_OUT_ELIPSE,
  PATH_OUT_RECT,
  RectBlock,
} from "@quasi-dev/visual-flow";
import { view } from "refina";
import { graph } from "../store";

export default view(_ => {
  if (_.fAccordion("Special")) {
    _.$cls`flex flex-wrap justify-around`;
    _.div(_ => {
      _.forRange(6, i => {
        _.$cls`my-1 border-2 border-transparent hover:border-gray-400`;
        _.vfCreator(
          graph,
          _ => {
            _.img("https://via.placeholder.com/80x80?text=" + i);
            _.$cls`text-center text-sm`;
            _.div("Root");
          },
          () => {
            const block = new RectBlock();
            const socket1 = new InSocket();
            socket1.path = PATH_IN_RECT;
            socket1.type = "L";
            socket1.disabled = true;
            block.addSocket(Direction.LEFT, socket1);

            const socket2 = new MultiOutSocket();
            socket2.path = PATH_OUT_RECT;
            socket2.type = "L";
            socket2.disabled = false;
            block.addSocket(Direction.RIGHT, socket2);

            //@ts-ignore
            block.name = "block " + i;
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
    _.div(_ => {
      _.forRange(12, i => {
        _.$cls`my-1`;
        _.div(_ => {
          _.img("https://via.placeholder.com/80x80?text=" + i);
          _.$cls`text-center text-sm overflow-hidden`;
          _.div("Text input");
        });
      });
    });
  }
  if (_.fAccordion("Views")) {
    _.$cls`flex flex-wrap justify-around`;
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
