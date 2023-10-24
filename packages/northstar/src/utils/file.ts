import { exportVf, importVf } from "@quasi-dev/visual-flow";
import { currentGraph, views } from "../store";

export async function open() {
  const [handle] = await window.showOpenFilePicker({
    types: [
      {
        description: "Quasi Studio Project",
        accept: {
          "application/json": [".q.json"],
        },
      },
    ],
  });
  const file = await handle.getFile();
  const json = await file.text();
  const proj = JSON.parse(json);
  for (const { id, graph } of proj.views) {
    importVf(graph, views.get(id)?.graph);
  }
}

export async function saveAs() {
  const handle = await window.showSaveFilePicker({
    suggestedName: "Untitled.json",
    types: [
      {
        description: "Quasi Studio Project",
        accept: {
          "application/json": [".q.json"],
        },
      },
    ],
  });
  const writable = await handle.createWritable();
  const proj = {
    views: [...views.entries()].map(([id, view]) => ({
      id,
      graph: exportVf(view.graph),
    })),
  };
  await writable.write(JSON.stringify(proj, null, 2));
  await writable.close();
}
