import { Graph } from "../model";
import { setCurrentId } from "../utils";
import { blockCtors, lineCtors, socketCtors } from "./ctors";
import { VfRecord } from "./types";

export function importVf(record: VfRecord, graphRaw?: Graph) {
  if (graphRaw) {
    graphRaw.reset();
  } else {
    graphRaw = new Graph();
    graphRaw.recordStack = [record];
    graphRaw.recordIndex = 0;
  }
  const graph = graphRaw;

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
    graph.addLine(line);
    setCurrentId(lineRecord.id);
  });

  graph.importRecord(record.graph, blocks);

  return graph;
}
