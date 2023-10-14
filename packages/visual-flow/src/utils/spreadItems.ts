/**
 * Calculate the position of items.
 * Additional `paddingScale*length` padding is added to the left and right.
 */
export function spreadItems(length: number, itemNum: number, paddingScale: number) {
  const positions: number[] = [];
  const offset = ((1 - 2 * paddingScale) * length) / (itemNum + 1);
  let x = paddingScale * length;
  for (let i = 0; i < itemNum; i++) {
    x += offset;
    positions.push(x);
  }
  return positions;
}
