import { Block, Line, Socket, Graph } from "../model";
import { CtorMap, VfRecord } from "./types";

export function importVf(
  blockCtors: CtorMap<Block>,
  socketCtors: CtorMap<Socket>,
  lineCtors: CtorMap<Line>,
  record: VfRecord,
) {
  const graph = new Graph();

  const sockets = Object.fromEntries(
    record.sockets.map((socketRecord) => {
      const socket = new socketCtors[socketRecord.ctor]();
      return [socketRecord.id, socket];
    }),
  );

  const blocks = Object.fromEntries(
    record.blocks.map((blockRecord) => {
      const block = new blockCtors[blockRecord.ctor]();
      block.importRecord(blockRecord, sockets);
      graph.addBlock(block);
      return [block.id, block];
    }),
  );

  record.lines.forEach((lineRecord) => {
    const line = new lineCtors[lineRecord.ctor]();
    line.importRecord(lineRecord, sockets);
    line.connect(sockets[lineRecord.socketAId]);
    line.connect(sockets[lineRecord.socketBId]);
    graph.addLine(line);
  });

  graph.importRecord(record.graph, blocks);
}
