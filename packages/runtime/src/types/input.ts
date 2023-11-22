import { PositionInfo } from "./base";

export type InputMode =
  | "as-socket"
  | "as-primary"
  | "as-primary-and-socket"
  | "as-hidden-socket"
  | "as-hidable-socket";

export interface InputInfo {
  displayName: string;
  mode: InputMode;
  position: PositionInfo;
}

export function input(
  displayName: string,
  mode: InputMode = "as-socket",
  position: PositionInfo = null,
): InputInfo {
  return {
    displayName,
    mode,
    position,
  };
}
