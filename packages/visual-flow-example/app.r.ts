/// <reference types="vite/client" />
import { Direction, Graph, InSocket, MultiOutSocket, RectBlock, SingleOutSocket } from "@quasi-dev/visual-flow";
import "@refina/fluentui";
import { app } from "refina";

const graph = new Graph();

const socket1 = new InSocket();
socket1.label = "in(L)";
socket1.type = "L";

const socket12 = new InSocket();
socket12.label = "in(L)";
socket12.type = "L";

const socket2 = new SingleOutSocket();
socket2.label = "s-out(D)";
socket2.type = "D";

const socket3 = new InSocket();
socket3.label = "in(D)";
socket3.type = "D";

const socket4 = new MultiOutSocket();
socket4.label = "m-out(L)";
socket4.type = "L";

const socket5 = new MultiOutSocket();
socket5.label = "m-out(D)";
socket5.type = "D";

const block1 = new RectBlock();
block1.content = (_) => _._svgText({}, "block1");
block1.nonAttachedPageX = 50;
block1.nonAttachedPageY = 100;
block1.boardHeight = 50;
block1.boardWidth = 200;

const block2 = new RectBlock();
block1.content = (_) => _._svgText({}, "block2");
block2.nonAttachedPageX = 300;
block2.nonAttachedPageY = 100;
block2.boardHeight = 50;
block2.boardWidth = 200;

graph.addBlock(block1);
graph.addBlock(block2);

block1.addSocket(Direction.TOP, socket1);
block1.addSocket(Direction.TOP, socket12);
block1.addSocket(Direction.RIGHT, socket2);
block1.addSocket(Direction.BOTTOM, socket3);
block2.addSocket(Direction.TOP, socket4);
block2.addSocket(Direction.LEFT, socket5);

app((_) => {
  _.$rootCss`position:fixed; top:0; left:0; right:0; bottom:0;`;

  _.provideFTheme();

  _._h1({}, "Visual flow example");

  _._br();
  _._br();
  _._br();
  _._br();
  _._p({}, `scale: ${graph.boardScale}`);
  _._p({}, `offsetX: ${graph.boardOffsetX}`);
  _._p({}, `offsetY: ${graph.boardOffsetY}`);

  _.$css`position:relative;left:10%;width:80%;height:60%;border: 2px blue dashed;`;
  _._div({}, () => _.vfGraph(graph));
});
