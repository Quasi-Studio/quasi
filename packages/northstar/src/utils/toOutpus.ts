import {
  ComponentBlockOutput,
  isComponentBlock,
  toBlockOutput,
} from "../blocks/component";
import { SpecialBlockOutput } from "../blocks/special";
import { SpecialBlock } from "../blocks/special/base";
import { currentGraph } from "../store";

export interface ViewOutput {
  name: string;
  components: ComponentBlockOutput[];
  specialBlocks: SpecialBlockOutput[];
}

export interface QuasiOutput {
  views: ViewOutput[];
}

export function toOutput() {
  return {
    views: [
      {
        name: "view1",
        components: currentGraph.blocks
          .filter(isComponentBlock)
          .map(toBlockOutput),
        specialBlocks: currentGraph.blocks
          .filter((b) => !isComponentBlock(b))
          .map((b) => (b as unknown as SpecialBlock).toOutput()),
      },
    ],
  } satisfies QuasiOutput;
}
