import { exportVf } from "@quasi-dev/visual-flow";
import { graph } from "../store";

export async function open() {
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
  await writable.write(JSON.stringify(exportVf(graph)));
  await writable.close();
}
