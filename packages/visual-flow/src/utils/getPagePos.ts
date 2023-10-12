export function getPagePos(ev: MouseEvent) {
  console.log("getPagePos", ev.pageX, ev.pageY);
  return { x: ev.pageX, y: ev.pageY };
}
