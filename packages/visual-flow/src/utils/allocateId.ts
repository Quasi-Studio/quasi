let currentId = 0

export function setCurrentId(id: number) {
  currentId = Math.max(currentId, id)
}

export function allocateId() {
  return currentId++
}
