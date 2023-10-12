/// <reference types="vite/client" />
import { app } from "refina";
import { Block, Direction, Graph, Socket } from "@quasi-dev/visual-flow";
import "@refina/fluentui";

const graph = new Graph();

const socket1 = new Socket("1");
const socket2 = new Socket("2");
const socket3 = new Socket("3");

const block1 = new Block("111");
block1.pageX = 50;
block1.pageY = 100;
block1.height = 50;
block1.width = 200;
block1.addSocket(Direction.RIGHT, socket1);

const block2 = new Block("222");
block2.pageX = 300;
block2.pageY = 100;
block2.height = 50;
block2.width = 200;
block2.addSocket(Direction.TOP, socket2);
block2.addSocket(Direction.TOP, socket3);

graph.addBlock(block1);
graph.addBlock(block2);

app((_) => {
  _.$rootCss`position:fixed; top:0; left:0; right:0; bottom:0;`;

  _.provideFTheme();

  _._h1({}, "Visual flow example");

  _.$css`position:relative;left:10%;top:10%; width:80%;height:60%;border: 2px blue dashed;`;
  _._div({}, () => _.vfGraph(graph));
});
