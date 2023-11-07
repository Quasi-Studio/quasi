import { ComponentInfo } from "@quasi-dev/block-data";
import {
  Direction,
  RectBlock,
  Socket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import "@refina/fluentui";
import { d } from "refina";
import { PropsData } from "../../utils/props";
import { getContent } from "./getContent.r";
import { getProps } from "./getProps";
import { updateSockets } from "./updateSockets";
import { updatePlugins } from "./updatePlugins";

export class ComponentBlock extends RectBlock {
  isComponentBlock = true;

  removable = true;
  duplicateable = true;

  componentType: string;
  info: ComponentInfo;
  props: Record<string, string | boolean> = {};

  socketMap = new Map<string, Socket>();

  boardWidth = 200;
  boardHeight = 50;

  primaryValue = d("");
  get primaryFilled() {
    return this.primaryValue.value !== "";
  }
  getPrimaryDisabled = () => false;

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
    return socket;
  }

  initialize(componentType: string, info: ComponentInfo) {
    this.componentType = componentType;
    this.info = info;
    this.content = getContent(this);
    updateSockets(this);
    updatePlugins(this);
  }

  clone() {
    const block = new ComponentBlock();
    block.initialize(this.componentType, this.info);
    return block;
  }

  getProps(): PropsData {
    return getProps(this);
  }

  protected exportData() {
    return {
      ...super.exportData(),
      componentType: this.componentType,
      info: this.info,
      props: this.props,
      primaryValue: this.primaryValue.value,
    };
  }
  protected importData(data: any, sockets: Record<number, Socket>): void {
    super.importData(data, sockets);
    this.componentType = data.componentType;
    this.info = data.info;
    this.props = data.props;
    this.primaryValue.value = data.primaryValue;
    this.content = getContent(this);
    for (const socket of this.allSockets) {
      this.socketMap.set(socket.label, socket);
    }
    updateSockets(this);
  }
}

blockCtors["ComponentBlock"] = ComponentBlock;

export function isComponentBlock(block: any): block is ComponentBlock {
  return Boolean(block.isComponentBlock);
}
