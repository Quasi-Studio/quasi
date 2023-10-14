import { allocateId } from "../utils";
import { Graph } from "./graph";

export abstract class ModelBase {
  id: number = allocateId();
  graph: Graph;
}
