import { Props } from "../../utils/props";

export interface SpecialBlock {
  getProps(): Props;
  toOutput(): any;
  initialize(): void;
}
