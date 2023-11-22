import { Direction } from "./base";

export interface PluginInfo {
  displayName: string;
  kind: string;
  direction: Direction;
}

export function plugin(
  displayName: string,
  kind: string,
  direction: Direction = Direction.LEFT,
): PluginInfo {
  return {
    displayName,
    kind,
    direction,
  };
}
