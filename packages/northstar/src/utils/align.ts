import { currentGraph } from "../store";

export function hasBlocksToAlign() {
  return currentGraph.selectedBlocks.size > 1;
}

export function alignBlocksToLeft() {
  const blocks = [...currentGraph.selectedBlocks];
  const left = Math.min(...blocks.map(b => b.boardX));
  blocks.forEach(b => (b.boardX = left));
  currentGraph.pushRecord();
}

export function alignBlocksToTop() {
  const blocks = [...currentGraph.selectedBlocks];
  const top = Math.min(...blocks.map(b => b.boardY));
  blocks.forEach(b => (b.boardY = top));
  currentGraph.pushRecord();
}
