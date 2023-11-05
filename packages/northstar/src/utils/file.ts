import { exportVf, importVf } from "@quasi-dev/visual-flow";
import { currentViewId, setCurrentView, views } from "../store";

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
  views.clear();
  for (const { id, graph: graphRecord } of proj.views) {
    const graph = importVf(graphRecord);
    views.set(id, { graph });
  }
  setCurrentView(proj.currentViewId);
}

export async function saveAs() {
  const handle = await window.showSaveFilePicker({
    suggestedName: "Untitled.q.json",
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
    currentViewId,
  };
  await writable.write(JSON.stringify(proj, null, 2));
  await writable.close();
}
