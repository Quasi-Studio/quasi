import { ViewOutput } from "@quasi-dev/compiler";
import { Graph, exportVf, importVf } from "@quasi-dev/visual-flow";
import { isComponentBlock, toBlockOutput } from "../blocks/component";
import { SpecialBlock } from "../blocks/special/base";
import { RootBlock } from "../blocks/special/root.r";

export class Project {
  name: string;
  views: (null | {
    name: string;
    graph: Graph;
  })[];
  activeViewId: number;

  get activeView() {
    return this.views[this.activeViewId]!;
  }
  get activeGraph() {
    return this.views[this.activeViewId]!.graph;
  }

  addView() {
    const graph = new Graph();
    const rootBlock = new RootBlock();
    rootBlock.boardX = 120;
    rootBlock.boardY = 300;
    rootBlock.attached = true;
    graph.addBlock(rootBlock);
    graph.captureInitialRecord();

    this.views.push({
      name: `view${this.views.length}`,
      graph,
    });

    return this.views.length - 1;
  }
  removeView(id: number) {
    this.views.splice(id, 1);
  }
  setActiveView(id: number) {
    this.activeGraph.clearSelectedBlocks();
    this.activeViewId = id;
  }

  dump(): string {
    const data = {
      name: this.name,
      views: this.views
        .filter((view) => view !== null)
        .map((view) => ({
          name: view!.name,
          graph: exportVf(view!.graph),
        })),
      activeViewId: this.activeViewId,
    };
    return import.meta.env.DEV
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
  }
  static load(json: string): Project {
    const data = JSON.parse(json);
    const project = new Project();
    project.name = data.name;
    project.views = data.views.map((view: any) => ({
      name: view.name,
      graph: importVf(view.graph),
    }));
    project.activeViewId = data.activeViewId;
    return project;
  }
  static new(): Project {
    const project = new Project();
    project.name = "Untitled";
    project.views = [];
    project.activeViewId = 0;
    project.addView();
    project.views[0]!.name = "app";
    return project;
  }

  toOutput() {
    const viewsOutput: ViewOutput[] = [];
    currentProject.views.forEach((view, id) => {
      if (view === null) return;
      viewsOutput.push({
        name: view.name,
        componentBlocks: view.graph.blocks
          .filter(isComponentBlock)
          .map(toBlockOutput),
        specialBlocks: view.graph.blocks
          .filter((b) => !isComponentBlock(b))
          .map((b) => (b as unknown as SpecialBlock).toOutput()),
      });
    });
    return {
      views: viewsOutput,
    };
  }
}

export let currentProject: Project;
export function setCurrentProject(project: Project) {
  currentProject = project;
}
