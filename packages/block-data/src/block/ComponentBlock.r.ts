import {
  Direction,
  InSocket,
  MultiOutSocket,
  PATH_IN_ELIPSE,
  PATH_IN_RECT,
  PATH_OUT_ELIPSE,
  PATH_OUT_RECT,
  PATH_OUT_TRIANGLE,
  RectBlock,
  SingleOutSocket,
  Socket,
} from "@quasi-dev/visual-flow";
import { ComponentInfo } from "../types";
import "@refina/fluentui";

export class ComponentBlock extends RectBlock {
  constructor(
    public componentId: string,
    public info: ComponentInfo,
  ) {
    super();

    this.content = (_) => {
      _.t(info.displayName ?? componentId);
      if (info.content !== undefined) {
        _.embed(info.content, this);
      }
    };

    const layoutInSocket = new InSocket();
    layoutInSocket.type = "L";
    layoutInSocket.path = PATH_IN_RECT;
    this.addSocket(Direction.LEFT, layoutInSocket);

    if (info.kind === "trigger") {
      const eventOutSocket = new MultiOutSocket();
      eventOutSocket.type = "E";
      eventOutSocket.path = PATH_OUT_TRIANGLE;
      this.addSocket(Direction.BOTTOM, eventOutSocket);
    }

    for (const param of info.params) {
      if (param.noSocket === true) continue;
      let socket: Socket;
      let direction: Direction;
      switch (param.type[0]) {
        case "content":
          socket = new SingleOutSocket();
          socket.type = "L";
          socket.path = PATH_OUT_RECT;
          direction = Direction.RIGHT;
          break;
        case "output":
          socket = new MultiOutSocket();
          socket.type = "D:" + param.type[1];
          socket.path = PATH_OUT_ELIPSE;
          direction = Direction.BOTTOM;
          break;
        case "input":
          socket = new InSocket();
          socket.type = "D:" + param.type[1];
          socket.path = PATH_IN_ELIPSE;
          direction = Direction.TOP;
          break;
        case "singleOutput":
          socket = new SingleOutSocket();
          socket.type = "D:" + param.type[1];
          socket.path = PATH_IN_ELIPSE;
          direction = Direction.BOTTOM;
          break;
        default:
          const _: never = param.type[0];
      }
      socket!.label = param.name;
      this.addSocket(direction!, socket!);
    }

    this.boardWidth = Math.max(this.topSockets.length, this.bottomSockets.length) * 10 + 200;
    this.boardHeight = Math.max(50, Math.max(this.leftSockets.length, this.rightSockets.length) * 50 + 10);
    this.updateSocketPosition();
  }

  ctor() {
    return new ComponentBlock(this.componentId, this.info);
  }
}
