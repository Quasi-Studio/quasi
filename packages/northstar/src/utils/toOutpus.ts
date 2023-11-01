import type { QuasiOutput } from "@quasi-dev/compiler";
import { isComponentBlock, toBlockOutput } from "../blocks/component";
import { SpecialBlock } from "../blocks/special/base";
import { currentGraph } from "../store";

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
