import { Direction, InSocket, MultiOutSocket, RectBlock, SingleOutSocket, Socket } from "@quasi-dev/visual-flow";
import { ComponentInfo } from "../types";
import "@refina/fluentui";

export class ComponentBlock extends RectBlock {
  constructor(
    public componentId: string,
    public info: ComponentInfo,
  ) {
    super();

    this.contentMain = (_) => {
      _.t(info.displayName ?? componentId);
      if (info.content !== undefined) {
        _.embed(info.content, this);
      }
    };

    const layoutInSocket = new InSocket();
    layoutInSocket.type = "L";
    this.addSocket(Direction.LEFT, layoutInSocket);

    for (const param of info.params) {
      if (param.noSocket === true) continue;
      let socket: Socket;
      let direction: Direction;
      switch (param.type[0]) {
        case "content":
          socket = new InSocket();
          socket.type = "L";
          direction = Direction.RIGHT;
          break;
        case "output":
          socket = new MultiOutSocket();
          socket.type = "D:" + param.type[1];
          direction = Direction.TOP;
          break;
        case "input":
          socket = new InSocket();
          socket.type = "D:" + param.type[1];
          direction = Direction.BOTTOM;
          break;
        case "singleOutput":
          socket = new SingleOutSocket();
          socket.type = "D:" + param.type[1];
          direction = Direction.TOP;
          break;
        default:
          const _: never = param.type[0];
      }
      socket!.label = param.name;
      this.addSocket(direction!, socket!);
    }
  }

  ctor() {
    return new ComponentBlock(this.componentId, this.info);
  }
}
