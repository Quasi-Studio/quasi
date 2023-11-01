import type { ViewOutput } from "@quasi-dev/compiler";
import { isComponentBlock, toBlockOutput } from "../blocks/component";
import { SpecialBlock } from "../blocks/special/base";
import { views } from "../store";

export function toOutput() {
  const viewsOutput: ViewOutput[] = [];
  views.forEach((view, name) => {
    viewsOutput.push({
      name,
      components: view.graph.blocks.filter(isComponentBlock).map(toBlockOutput),
      specialBlocks: view.graph.blocks
        .filter((b) => !isComponentBlock(b))
        .map((b) => (b as unknown as SpecialBlock).toOutput()),
    });
  });
}
