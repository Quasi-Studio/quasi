import { allocateId } from "../utils";

export abstract class ModelBase {
  id: number = allocateId();
}
