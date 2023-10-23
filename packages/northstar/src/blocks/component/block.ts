import { ComponentInfo } from "@quasi-dev/block-data";
import {
  Direction,
  RectBlock,
  Socket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import "@refina/fluentui";
import { updateSockets } from "./updateSockets";
import { d } from "refina";
import { getContent } from "./getContent.r";

export class ComponentBlock extends RectBlock {
  isComponentBlock = true;

  componentType: string;
  info: ComponentInfo;
  props: Record<string, any> = {};

  socketMap = new Map<string, Socket>();

  primaryValue = d.trim("");
  get primaryFilled() {
    return this.primaryValue.value !== "";
  }

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
    if (data.disabled) {
      socket.allConnectedLines.forEach((l) => {
        l.a.disconnectTo(l);
        (l.b as Socket).disconnectTo(l);
        this.graph.removeLine(l);
      });
    }
    Object.assign(socket, data);
  }

  initialize(componentType: string, info: ComponentInfo) {
    this.componentType = componentType;
    this.info = info;
    this.content = getContent(this);
    updateSockets(this);
  }

  ctor() {
    const block = new ComponentBlock();
    block.initialize(this.componentType, this.info);
    return block;
  }

  protected exportData() {
    return {
      ...super.exportData(),
      componentType: this.componentType,
      info: this.info,
      props: this.props,
    };
  }
  protected importData(data: any, sockets: Record<number, Socket>): void {
    super.importData(data, sockets);
    this.componentType = data.componentType;
    this.info = data.info;
    this.props = data.props;
    this.content = getContent(this);
    for(const socket of this.allSockets){
      this.socketMap.set(socket.label, socket);
    }
  }
}

blockCtors["ComponentBlock"] = ComponentBlock;

export function isComponentBlock(block: any): block is ComponentBlock {
  return Boolean(block.isComponentBlock);
}
