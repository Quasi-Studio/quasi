/// <reference types="vite/client" />
import { ComponentBlock, flentuiBlocks } from "@quasi-dev/block-data";
import Vf, { Graph, exportVf, importVf } from "@quasi-dev/visual-flow";
import FluentUI from "@refina/fluentui";
import { app, d } from "refina";

let graph = new Graph();

const blockName = d("");
const record = d("");

app.use(FluentUI).use(Vf)((_) => {
  _.$rootCss`position:fixed; top:0; left:0; right:0; bottom:0;`;

  _.$css`position:fixed;left:0;top:0;width:100%;height:5%;z-index:101;
    background-color:#ddd;border-bottom:3px gray solid`;
  _._div({}, () => _._h3({}, "Visual Flow | Quasi Studio"));

  _.$css`position:fixed;left:0;top:5%;width:15%;height:100%;z-index:100;
    background-color:#fefefe;border-right:3px gray solid`;
  _._div({}, () => {
    _._h4({}, "Blocks");

    _.fTextInput(blockName, false, "Input block name here...");

    _.for(
      Object.entries(flentuiBlocks),
      ([k, v]: [string, any]) => k,
      ([k, v]) => {
        _.vfCreator(
          graph,
          () => _.fButton(v.displayName ?? k),
          () => {
            const block = new ComponentBlock(k, v);
            return block;
          },
        );
      },
    );

    _._p({}, `scale: ${graph.boardScale}`);
    _._p({}, `offsetX: ${graph.boardOffsetX}`);
    _._p({}, `offsetY: ${graph.boardOffsetY}`);

    if (_.fButton("undo", !graph.canUndo)) {
      graph.undo();
    }
    if (_.fButton("redo", !graph.canRedo)) {
      graph.redo();
    }

    if (_.fButton("export")) {
      record.value = JSON.stringify(exportVf(graph));
    }
    if (_.fButton("import")) {
      graph = importVf(JSON.parse(record.value));
    }
    _._br();
    _.fTextInput(record);
  });

  _.$css`position:absolute;left:15%;top:5%;width:85%;height:95%;`;
  _._div({}, () => _.vfGraph(graph));
});

/*
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
        socket1.path = PATH_IN_RECT;

        const socket2 = new InSocket();
        socket2.label = "in(D)";
        socket2.type = "D";
        socket2.path = PATH_IN_ELIPSE;

        const socket3 = new SingleOutSocket();
        socket3.label = "s-out(D)";
        socket3.type = "D";
        socket3.path = PATH_OUT_ELIPSE;

        const socket4 = new SingleOutSocket();
        socket4.label = "out(L)";
        socket4.type = "L";
        socket4.path = PATH_OUT_RECT;

        block.addSocket(Direction.LEFT, socket1);
        block.addSocket(Direction.TOP, socket2);
        block.addSocket(Direction.BOTTOM, socket3);
        block.addSocket(Direction.RIGHT, socket4);

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
    _.vfCreator(
      graph,
      () => _.fButton("Input block"),
      () => {
        const block = new RectBlock();
        block.boardHeight = 50;
        block.boardWidth = 200;
        block.content = (_) => _.t`Input ${blockName}`;
        blockName.value = "";
        block.dockableDirections = [Direction.LEFT, Direction.UP];

        const socket1 = new InSocket();
        socket1.type = "L";

        const socket2 = new MultiOutSocket();
        socket2.type = "D";

        block.addSocket(Direction.TOP, socket1);
        block.addSocket(Direction.LEFT, socket2);
        return block;
      },
    );
    _.vfCreator(
      graph,
      () => _.fButton("Validator block"),
      () => {
        const block = new RectBlock();
        block.boardHeight = 50;
        block.boardWidth = 200;
        block.content = (_) => _.t`Validator ${blockName}`;
        blockName.value = "";
        block.dockableDirections = [Direction.LEFT];
        block.dockingDirections = [Direction.LEFT];
        return block;
      },
    );
    _.vfCreator(
      graph,
      () => _.fButton("Validator block 2"),
      () => {
        const block = new RectBlock();
        block.boardHeight = 50;
        block.boardWidth = 200;
        block.content = (_) => _.t`Validator2 ${blockName}`;
        blockName.value = "";
        block.dockableDirections = [Direction.UP];
        block.dockingDirections = [Direction.UP];

        const socket1 = new MultiOutSocket();
        socket1.type = "L";

        block.addSocket(Direction.LEFT, socket1);

        return block;
      },
    );
    */
