import { Project, currentProject, setCurrentProject } from './project'

export async function openFile() {
  const [handle] = await window.showOpenFilePicker({
    types: [
      {
        description: 'Quasi Studio Project',
        accept: {
          'application/json': ['.q.json'],
        },
      },
    ],
  })
  const file = await handle.getFile()
  const json = await file.text()
  setCurrentProject(Project.load(json))
}

export async function saveAs() {
  const handle = await window.showSaveFilePicker({
    suggestedName: 'Untitled.q.json',
    types: [
      {
        description: 'Quasi Studio Project',
        accept: {
          'application/json': ['.q.json'],
        },
      },
    ],
  })
  const writable = await handle.createWritable()
  await writable.write(currentProject.dump())
  await writable.close()
}
