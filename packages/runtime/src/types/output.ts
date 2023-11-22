import { PositionInfo } from "./base";

export type OutputMode = "as-socket" | "as-hidden-socket" | "as-hidable-socket";

export interface OutputInfo {
  displayName: string;
  mode: OutputMode;
  position: PositionInfo;
}

export function output(
  displayName: string,
  mode: OutputMode = "as-socket",
  position: PositionInfo = null,
): OutputInfo {
  return {
    displayName,
    mode,
    position,
  };
}
