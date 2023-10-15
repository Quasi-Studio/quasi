/// <reference types="vite/client" />
import {
  Direction,
  Graph,
  InSocket,
  BasicLine,
  MultiOutSocket,
  RectBlock,
  SingleOutSocket,
  exportVf,
  importVf,
} from "@quasi-dev/visual-flow";
import "@refina/fluentui";
import { app, d } from "refina";
import { InputBlock } from "./components";

let graph = new Graph();

const blockName = d("");
const record = d("");

app((_) => {
  _.$rootCss`position:fixed; top:0; left:0; right:0; bottom:0;`;

  _.provideFTheme();

  _.$css`position:fixed;left:0;top:0;width:100%;height:5%;z-index:101;
    background-color:#ddd;border-bottom:3px gray solid`;
  _._div({}, () => _._h3({}, "Visual Flow | Quasi Studio"));

  _.$css`position:fixed;left:0;top:5%;width:15%;height:100%;z-index:100;
    background-color:#fefefe;border-right:3px gray solid`;
  _._div({}, () => {
    _._h4({}, "Blocks");

    _.fTextInput(blockName, false, "Input block name here...");

    _.vfCreator(
      graph,
      () => _.fButton("Block type 1"),
      () => {
        const block = new RectBlock();
        block.boardHeight = 50;
        block.boardWidth = 200;
        blockName.value = "";

        const socket1 = new InSocket();
        socket1.label = "in(L)";
        socket1.type = "L";

        const socket2 = new InSocket();
        socket2.label = "in(L)";
        socket2.type = "L";

        const socket3 = new SingleOutSocket();
        socket3.label = "s-out(D)";
        socket3.type = "D";

        const socket4 = new InSocket();
        socket4.label = "in(D)";
        socket4.type = "D";

        block.addSocket(Direction.TOP, socket1);
        block.addSocket(Direction.TOP, socket2);
        block.addSocket(Direction.RIGHT, socket3);
        block.addSocket(Direction.BOTTOM, socket4);

        return block;
      },
    );
    _.vfCreator(
      graph,
      () => _.fButton("Block type 2"),
      () => {
        const block = new InputBlock();
        block.boardHeight = 50;
        block.boardWidth = 200;
        blockName.value = "";
        const socket1 = new MultiOutSocket();
        socket1.label = "m-out(L)";
        socket1.type = "L";

        const socket2 = new MultiOutSocket();
        socket2.label = "m-out(D)";
        socket2.type = "D";

        block.addSocket(Direction.TOP, socket1);
        block.addSocket(Direction.LEFT, socket2);

        return block;
      },
    );
    _._p({}, `scale: ${graph.boardScale}`);
    _._p({}, `offsetX: ${graph.boardOffsetX}`);
    _._p({}, `offsetY: ${graph.boardOffsetY}`);

    if (_.fButton("export")) {
      record.value = JSON.stringify(exportVf(graph));
    }
    if (_.fButton("import")) {
      graph = importVf(
        {
          RectBlock,
          InputBlock,
        },
        {
          InSocket,
          MultiOutSocket,
          SingleOutSocket,
        },
        {
          BasicLine,
        },
        JSON.parse(record.value),
      );
    }
    _._br();
    _.fTextInput(record);
  });

  _.$css`position:absolute;left:15%;top:5%;width:85%;height:95%;`;
  _._div({}, () => _.vfGraph(graph));
});
