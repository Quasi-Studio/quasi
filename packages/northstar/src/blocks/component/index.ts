import { ComponentInfo } from "@quasi-dev/block-data";
import {
  Direction,
  RectBlock,
  Socket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import "@refina/fluentui";
import { updateSockets } from "./updateSockets";

export class ComponentBlock extends RectBlock {
  isComponentBlock = true;

  componentType: string;
  info: ComponentInfo;
  props: Record<string, any> = {};
  primaryFilled = false;
  socketMap = new Map<string, Socket>();

  removeSocket(name: string) {
    const socket = this.socketMap.get(name);
    if (!socket) return;
    socket.allConnectedLines.forEach((l) => {
      l.a.disconnectTo(l);
      (l.b as Socket).disconnectTo(l);
      this.graph.removeLine(l);
    });
    const sockets = this.getSocketsByDirection(socket.direction);
    const index = sockets.indexOf(socket);
    sockets.splice(index, 1);
  }

  updateSocket<T extends Socket>(
    name: string,
    ctor: new () => T,
    direction: Direction,
    data: Partial<T>,
  ) {
    let socket = this.socketMap.get(name);
    if (!socket) {
      socket = new ctor();
      socket.label = name;
      this.addSocket(direction, socket);
      this.socketMap.set(name, socket);
    }
    Object.assign(socket, data);
  }

  initialize(componentType: string, info: ComponentInfo) {
    this.componentType = componentType;
    this.info = info;
    updateSockets(this);
  }

  ctor() {
    const block = new ComponentBlock();
    block.initialize(this.componentType, this.info);
    return block;
  }
}

blockCtors["ComponentBlock"] = ComponentBlock;

export function isComponentBlock(block: any): block is ComponentBlock {
  return Boolean(block.isComponentBlock);
}
