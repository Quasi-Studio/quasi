import { DOMNodeComponent, ref } from "refina";

let currentId = 0;

export class ModelBase<N extends Node = Node> {
  ref = ref<DOMNodeComponent<N>>();
  get el() {
    return this.ref.current?.node;
  }

  id: number;
  constructor() {
    this.id = currentId++;
  }
}
