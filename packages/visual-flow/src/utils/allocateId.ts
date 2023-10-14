
let currentId = 0;

export function allocateId() {
  return currentId++;
}