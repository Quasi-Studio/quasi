import { Project, currentProject, setCurrentProject } from "./project";

export const STORAGE = sessionStorage;
export const STORAGE_KEY = "northstar";
export const AUTOSAVE_INTERVAL = 1000;

export function loadAutoSaved() {
  const initialStorage = STORAGE.getItem(STORAGE_KEY);
  if (initialStorage) {
    try {
      setCurrentProject(Project.load(initialStorage));
    } catch (e) {
      console.error(e);
      alert(`Failed to load project from storage due to ${e}`);
      setCurrentProject(Project.new());
    }
  } else {
    setCurrentProject(Project.new());
  }
}

export function setAutoSaveInterval() {
  setInterval(() => {
    STORAGE.setItem(STORAGE_KEY, currentProject.dump());
  }, AUTOSAVE_INTERVAL);
}
