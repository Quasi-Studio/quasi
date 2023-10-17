import type {
  BlockRecord,
  GraphRecord,
  LineRecord,
  SocketRecord
} from "../model";

export type CtorMap<T> = Record<string, new () => T>;

export interface VfRecord {
  graph: GraphRecord;
  blocks: BlockRecord[];
  sockets: SocketRecord[];
  lines: LineRecord[];
}
