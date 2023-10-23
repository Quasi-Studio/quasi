import {
  ComponentBlockOutput,
  isComponentBlock,
  toBlockOutput,
} from "../blocks/component";
import { currentGraph } from "../store";

export interface ViewOutput {
  name: string;
  components: ComponentBlockOutput[];
}

export interface QuasiOutput {
  views: ViewOutput[];
}

export function toOutput() {
  return {
    views: [
      {
        name: "view1",
        components: currentGraph.blocks.filter(isComponentBlock).map(toBlockOutput),
      },
    ],
  } satisfies QuasiOutput;
}
