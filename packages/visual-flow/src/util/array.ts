function exist<T>(e: T[], f: (e: T) => boolean): boolean {
  return find(e, f) !== undefined;
}

function find<T>(e: T[], f: (e: T) => boolean): T | undefined {
  for (let i of e) if (f(i)) return i;
  return undefined;
}

export { exist, find };
