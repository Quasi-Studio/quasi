/// <reference types="vite/client" />
import { app } from "refina";
import { Block, Graph } from "@quasi-dev/visual-flow";
import "@quasi-dev/visual-flow/styles.css";

const graph = new Graph();

const block1 = new Block("111");
block1.x = 100;
block1.y = 100;
block1.height = 50;
block1.width = 300;
const block2 = new Block("222");
block2.x = 300;
block2.y = 300;
block2.height = 50;
block2.width = 300;

graph.addBlock(block1);
graph.addBlock(block2);

app((_) => {
  _._h1({}, "Visual flow example");
  _.$css`border: 2px blue dashed;`;
  _.vfGraph(graph);
});
