import { RectBlock } from "@quasi-dev/visual-flow";

export function updateSize(block: RectBlock) {
  block.boardWidth =
    Math.max(block.topSockets.length, block.bottomSockets.length) * 10 + 200;
  block.boardHeight = Math.max(
    50,
    Math.max(block.leftSockets.length, block.rightSockets.length) * 50 + 10,
  );
  block.updateSocketPosition();
}
