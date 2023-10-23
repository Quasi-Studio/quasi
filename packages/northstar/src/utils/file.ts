import { exportVf, importVf } from "@quasi-dev/visual-flow";
import { currentGraph } from "../store";

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
  const vf = JSON.parse(json);
  importVf(vf, currentGraph);
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
  await writable.write(JSON.stringify(exportVf(currentGraph)));
  await writable.close();
}
