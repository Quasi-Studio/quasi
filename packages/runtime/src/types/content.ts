import { PositionInfo } from "./base";

export type ContentMode =
  | "as-socket"
  | "as-primary"
  | "as-primary-and-socket"
  | "as-hidden-socket"
  | "as-hidable-socket";

export interface ContentInfo {
  displayName: string;
  mode: ContentMode;
  position: PositionInfo;
}

export function content(
  displayName: string = "inner",
  mode: ContentMode = "as-socket",
  position: PositionInfo = null,
): ContentInfo {
  return {
    displayName,
    mode,
    position,
  };
}
