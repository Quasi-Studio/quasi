import { PropsData } from "../../utils/props";

export interface SpecialBlock {
  getProps(): PropsData;
  toOutput(): any;
  initialize(): void;
}
