import { Graph } from "@quasi-dev/visual-flow";

export const views = new Map<
  string,
  {
    graph: Graph;
  }
>([
  [
    "app",
    {
      graph: new Graph(),
    },
  ],
]);
export let currentViewId = "app";
export let currentGraph = views.get(currentViewId)!.graph;

let newViewId = 0;
export function createNewView() {
  const id = `view${newViewId++}`;
  views.set(id, { graph: new Graph() });
  return id;
}
export function setCurrentView(id: string) {
  currentGraph.clearSelectedBlocks();
  currentViewId = id;
  currentGraph = views.get(id)?.graph || new Graph();
  views.set(id, { graph: currentGraph });
}
export function setCurrentViewId(id: string) {
  views.set(id, views.get(currentViewId)!);
  views.delete(currentViewId);
  currentViewId = id;
}
