import { Context } from "refina";
import { Block, Socket } from "../../model";
import { Direction, Point } from "../../types";
import { spreadItems } from "../../utils";
import styles from "./RectBlock.styles";

const SOCKET_PADDING_SCALE = 0.1;

export class RectBlock extends Block {
  boardWidth: number;
  boardHeight: number;
  boardBorderRadius: number = 8;

  get graphWidth() {
    return this.boardWidth * this.graph.boardScale;
  }
  get graphHeight() {
    return this.boardHeight * this.graph.boardScale;
  }
  get graphBorderRadius() {
    return this.boardBorderRadius * this.graph.boardScale;
  }

  get pageWidth() {
    return this.graphWidth;
  }
  get pageHeight() {
    return this.graphHeight;
  }
  get pageBorderRadius() {
    return this.graphBorderRadius;
  }

  leftSockets: Socket[] = [];
  rightSockets: Socket[] = [];
  topSockets: Socket[] = [];
  bottomSockets: Socket[] = [];

  get allSockets(): Socket[] {
    return [...this.leftSockets, ...this.rightSockets, ...this.topSockets, ...this.bottomSockets];
  }

  addSocket(direction: Direction, socket: Socket) {
    socket.block = this;
    socket.direction = direction;
    this.getSocketsByDirection(direction).push(socket);
    this.updateSocketPosition();
  }

  getSocketsByDirection(direction: Direction) {
    return {
      [Direction.LEFT]: this.leftSockets,
      [Direction.RIGHT]: this.rightSockets,
      [Direction.TOP]: this.topSockets,
      [Direction.BOTTOM]: this.bottomSockets,
    }[direction];
  }

  updateSocketPosition() {
    spreadItems(this.boardHeight, this.leftSockets.length, SOCKET_PADDING_SCALE).forEach((offset, i) => {
      this.leftSockets[i].blockX = 0;
      this.leftSockets[i].blockY = offset;
    });
    spreadItems(this.boardHeight, this.rightSockets.length, SOCKET_PADDING_SCALE).forEach((offset, i) => {
      this.rightSockets[i].blockX = this.boardWidth;
      this.rightSockets[i].blockY = offset;
    });
    spreadItems(this.boardWidth, this.topSockets.length, SOCKET_PADDING_SCALE).forEach((offset, i) => {
      this.topSockets[i].blockX = offset;
      this.topSockets[i].blockY = 0;
    });
    spreadItems(this.boardWidth, this.bottomSockets.length, SOCKET_PADDING_SCALE).forEach((offset, i) => {
      this.bottomSockets[i].blockX = offset;
      this.bottomSockets[i].blockY = this.boardHeight;
    });
  }

  isBlockPosInside(blockPos: Point): boolean {
    return blockPos.x >= 0 && blockPos.x <= this.boardWidth && blockPos.y >= 0 && blockPos.y <= this.boardHeight;
  }

  get backgroudPath(): string {
    const { pageHeight: height, pageWidth: width, pageBorderRadius: radius } = this;
    const t1 = radius / 4;
    const t2 = (radius * 3) / 4;

    return `m 0 ${radius} v ${height - radius * 2} c 0 ${t2} ${t1} ${radius} ${radius} ${radius} h ${
      width - radius * 2
    } c ${t2} 0 ${radius} -${t1} ${radius} -${radius} 
            v -${height - radius * 2} c 0 -${t2} -${t1} -${radius} -${radius} -${radius} h -${
              width - radius * 2
            } c -${t2} 0 -${radius} ${t1} -${radius} ${radius}`;
  }

  content: (_: Context) => void;

  contentMain = (_: Context) => {
    styles.contentOuterWrapper(_);
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _._div({}, () => {
      styles.contentInnerWrapper(_);
      _._div({}, this.content);
    });
  };
}