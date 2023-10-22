import { graph } from "../store";

export function hasBlocksToAlign() {
  return graph.selectedBlocks.size > 1;
}

export function alignBlocksToLeft() {
  const blocks = [...graph.selectedBlocks];
  const left = Math.min(...blocks.map(b => b.boardX));
  blocks.forEach(b => (b.boardX = left));
  graph.pushRecord();
}

export function alignBlocksToTop() {
  const blocks = [...graph.selectedBlocks];
  const top = Math.min(...blocks.map(b => b.boardY));
  blocks.forEach(b => (b.boardY = top));
  graph.pushRecord();
}
