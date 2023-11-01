import { ComponentBlockOutput } from "./componentBlock";
import { SpecialBlockOutput } from "./specialBlock";

export * from "./componentBlock";
export * from "./specialBlock";

export interface ViewOutput {
  name: string;
  componentBlocks: ComponentBlockOutput[];
  specialBlocks: SpecialBlockOutput[];
}

export interface QuasiOutput {
  views: ViewOutput[];
}
