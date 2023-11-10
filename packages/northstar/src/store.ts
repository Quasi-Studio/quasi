import { Graph } from "@quasi-dev/visual-flow";
import { RootBlock } from "./blocks/special/root.r";

export const views = new Map<
  string,
  {
    graph: Graph;
  }
>([
  [
    "app",
    {
      graph: createViewGraph(),
    },
  ],
]);
export let currentViewId = "app";
export let currentGraph = views.get(currentViewId)!.graph;

export function createViewGraph() {
  const graph = new Graph();

  const rootBlock = new RootBlock();
  rootBlock.boardX = 120;
  rootBlock.boardY = 300;
  rootBlock.attached = true;
  graph.addBlock(rootBlock);

  graph.captureInitialRecord();

  return graph;
}

let newViewId = 0;
export function createNewView() {
  const id = `view${newViewId++}`;

  const graph = createViewGraph();

  views.set(id, { graph });
  return id;
}
export function setCurrentView(id: string) {
  currentGraph.clearSelectedBlocks();
  currentViewId = id;
  currentGraph = views.get(id)!.graph;
  views.set(id, { graph: currentGraph });
}
export function setCurrentViewId(id: string) {
  views.set(id, views.get(currentViewId)!);
  views.delete(currentViewId);
  currentViewId = id;
}
