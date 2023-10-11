interface Guid {
  guid: string;
  alloc: () => Guid;
  count: number;
}

function alloc(par: Guid): Guid {
  let ret: Guid = {} as any;
  ret.guid = par.guid + "." + par.count.toString(36);
  par.count += 1; // may collapse when multi-thread
  ret.count = 0;
  ret.alloc = () => {
    return alloc(ret);
  };
  return ret;
}

function owner(e: Guid): string {
  return e.guid.substr(0, e.guid.lastIndexOf("."));
}

let root: Guid = {} as any;
root = {
  guid: "root",
  count: 0,
  alloc: () => {
    return alloc(root);
  },
};

export { root, owner };

export type { Guid };
