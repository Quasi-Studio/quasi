import { Context, D } from "refina";
import { Block, Socket } from "../../model";
import { Direction, Point } from "../../types";
import { spreadItems } from "../../utils";
import styles from "./RectBlock.styles";

const SOCKET_PADDING_SCALE = 0.1;

export class RectBlock extends Block {
  ctor(): Block {
    return new RectBlock();
  }

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

  getDockingBenchmarkBlockPos(direction: Direction): Point {
    switch (direction) {
      case Direction.LEFT:
        return new Point(0, 0);
      case Direction.RIGHT:
        return new Point(this.boardWidth, this.boardHeight);
      case Direction.TOP:
        return new Point(this.boardWidth, 0);
      case Direction.BOTTOM:
        return new Point(0, this.boardHeight);
    }
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
      _.$css`transform:scale(${this.graph.boardScale})`;
      _._div({}, this.content);
    });
  };

  createPredictor(): Block {
    const predictor = super.createPredictor() as RectBlock;
    predictor.boardWidth = this.boardWidth;
    predictor.boardHeight = this.boardHeight;
    predictor.boardBorderRadius = this.boardBorderRadius;
    predictor.content = () => {};
    return predictor;
  }

  protected exportData(): any {
    return {
      boardHeight: this.boardHeight,
      boardWidth: this.boardWidth,
      boardBorderRadius: this.boardBorderRadius,
      leftSockets: this.leftSockets.map((s) => s.id),
      rightSockets: this.rightSockets.map((s) => s.id),
      topSockets: this.topSockets.map((s) => s.id),
      bottomSockets: this.bottomSockets.map((s) => s.id),
    } satisfies RectBlockRecordData;
  }
  protected importSocket(direction: Direction, array: Socket[], socket: Socket) {
    socket.block = this;
    socket.direction = direction;
    array.push(socket);
  }
  protected importData(data: RectBlockRecordData, sockets: Record<number, Socket>): void {
    this.boardHeight = data.boardHeight;
    this.boardWidth = data.boardWidth;
    this.boardBorderRadius = data.boardBorderRadius;
    data.leftSockets.forEach((id) => this.importSocket(Direction.LEFT, this.leftSockets, sockets[id]));
    data.rightSockets.forEach((id) => this.importSocket(Direction.RIGHT, this.rightSockets, sockets[id]));
    data.topSockets.forEach((id) => this.importSocket(Direction.TOP, this.topSockets, sockets[id]));
    data.bottomSockets.forEach((id) => this.importSocket(Direction.BOTTOM, this.bottomSockets, sockets[id]));
    this.updateSocketPosition();
  }
}

interface RectBlockRecordData {
  boardHeight: number;
  boardWidth: number;
  boardBorderRadius: number;
  leftSockets: number[];
  rightSockets: number[];
  topSockets: number[];
  bottomSockets: number[];
}
