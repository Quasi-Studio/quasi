/// <reference types="vite/client" />
import { app } from "refina";
import { Block, Direction, Graph, Socket } from "@quasi-dev/visual-flow";
import "@quasi-dev/visual-flow/styles.css";

const graph = new Graph();

const socket1 = new Socket("1");
const socket2 = new Socket("2");
const socket3 = new Socket("3");

const block1 = new Block("111");
block1.x = 50;
block1.y = 100;
block1.height = 50;
block1.width = 200;
block1.addSocket(Direction.RIGHT, socket1);

const block2 = new Block("222");
block2.x = 300;
block2.y = 100;
block2.height = 50;
block2.width = 200;
block2.addSocket(Direction.TOP, socket2);
block2.addSocket(Direction.TOP, socket3);

graph.addBlock(block1);
graph.addBlock(block2);

app((_) => {
  _._h1({}, "Visual flow example");
  _.$css`width:100%;height:200px;`;
  _._div({}, () => {});
  _.$css`border: 2px blue dashed;`;
  _.vfGraph(graph);
});
