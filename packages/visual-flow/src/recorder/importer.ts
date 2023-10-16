import { Block, Line, Socket, Graph } from "../model";
import { setCurrentId } from "../utils";
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
      socket.importRecord(socketRecord);
      setCurrentId(socketRecord.id);
      return [socketRecord.id, socket];
    }),
  );

  const blocks = Object.fromEntries(
    record.blocks.map((blockRecord) => {
      const block = new blockCtors[blockRecord.ctor]();
      return [blockRecord.id, block];
    }),
  );

  record.blocks.forEach((blockRecord) => {
    const block = blocks[blockRecord.id];
    block.importRecord(blockRecord, blocks, sockets);
    graph.addBlock(block);
    setCurrentId(blockRecord.id);
  });

  record.lines.forEach((lineRecord) => {
    const line = new lineCtors[lineRecord.ctor]();
    line.importRecord(lineRecord, sockets);
    line.a = sockets[lineRecord.socketAId];
    line.b = sockets[lineRecord.socketBId];
    graph.addLine(line);
    setCurrentId(lineRecord.id);
  });

  graph.importRecord(record.graph, blocks);

  return graph;
}
