import { RectBlock } from "@quasi-dev/visual-flow";
import { view } from "refina";
import { graph } from "../store";

export default view((_) => {
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
