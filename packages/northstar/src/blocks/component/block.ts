import { ComponentInfo, blocksObj } from "@quasi-dev/block-data";
import {
  Direction,
  MultiInSocket,
  MultiOutSocket,
  PATH_IN_ELIPSE,
  PATH_IN_RECT,
  PATH_IN_TRIANGLE,
  PATH_OUT_ELIPSE,
  PATH_OUT_RECT,
  PATH_OUT_TRIANGLE,
  RectBlock,
  SingleInSocket,
  SingleOutSocket,
  Socket,
  UseSocket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import "@refina/fluentui";
import { d } from "refina";
import { PropsData } from "../../utils/props";
import { getContent } from "./getContent.r";
import { getProps } from "./getProps";
import { updatePlugins } from "./updatePlugins";

export class ComponentBlock extends RectBlock {
  cloneTo(target: this): this {
    super.cloneTo(target);
    target.setComponentType(this.componentType, this.info);
    target.props = { ...this.props };
    target.primaryValue.value = this.primaryValue.value;
    return target;
  }

  setComponentType(componentType: string, info: ComponentInfo) {
    this.componentType = componentType;
    this.info = info;
    this.content = getContent(this);
    updatePlugins(this);
  }

  isComponentBlock = true;

  removable = true;
  duplicateable = true;

  boardWidth = 200;
  boardHeight = 50;

  componentType: string;
  info: ComponentInfo;
  props: Record<string, string | boolean> = {};

  primaryValue = d("");
  get primaryFilled() {
    return this.primaryValue.value !== "";
  }
  getPrimaryDisabled = () => false;

  socketUpdater(useSocket: UseSocket): void {
    const { contents, events, inputs, outputs, methods } = this.info;

    useSocket("parent", SingleInSocket, {
      type: "L",
      path: PATH_IN_RECT,
      hideLabel: true,
      direction: Direction.LEFT,
    });

    const shouldHideSocket = (socketInfo: { kind: string; name: string }) => {
      const prop = this.props[`[${socketInfo.name}]`];
      return (
        (socketInfo.kind === "as-hided-socket" && prop !== true) ||
        (socketInfo.kind === "as-hidable-socket" && prop === false)
      );
    };

    for (const content of contents) {
      if (content.kind === "as-primary") {
      } else {
        if (shouldHideSocket(content)) continue;
        const socket = useSocket(content.name, MultiOutSocket, {
          type: "L",
          path: PATH_OUT_RECT,
          hideLabel: contents.length === 1,
          disabled:
            content.kind === "as-primary-and-socket" && this.primaryFilled,
          direction: content.position ?? Direction.RIGHT,
        });

        if (content.kind === "as-primary-and-socket") {
          this.getPrimaryDisabled = () => {
            return socket.allConnectedLines.length > 0;
          };
        }
      }
    }

    for (const event of events) {
      if (shouldHideSocket(event)) continue;
      useSocket(event.name, SingleOutSocket, {
        type: "E",
        path: PATH_OUT_TRIANGLE,
        direction: event.position ?? Direction.BOTTOM,
      });
    }

    for (const input of inputs) {
      if (input.kind === "as-primary") {
      } else {
        if (shouldHideSocket(input)) continue;
        const socket = useSocket(input.name, SingleInSocket, {
          type: "D",
          path: PATH_IN_ELIPSE,
          disabled:
            input.kind === "as-primary-and-socket" && this.primaryFilled,
          direction: input.position ?? Direction.UP,
        });

        if (input.kind === "as-primary-and-socket") {
          this.getPrimaryDisabled = () => {
            return socket.allConnectedLines.length > 0;
          };
        }
      }
    }

    for (const output of outputs) {
      if (shouldHideSocket(output)) continue;
      useSocket(output.name, MultiOutSocket, {
        type: "D",
        path: PATH_OUT_ELIPSE,
        direction: output.position ?? Direction.BOTTOM,
      });
    }

    for (const method of methods) {
      if (shouldHideSocket(method)) continue;
      useSocket(method.name, MultiInSocket, {
        type: "E",
        path: PATH_IN_TRIANGLE,
        direction: method.position ?? Direction.TOP,
      });
    }
  }

  getProps(): PropsData {
    return getProps(this);
  }

  protected exportData() {
    return {
      ...super.exportData(),
      componentType: this.componentType,
      props: this.props,
      primaryValue: this.primaryValue.value,
    };
  }
  protected importData(data: any, sockets: Record<number, Socket>): void {
    super.importData(data, sockets);
    this.componentType = data.componentType;
    this.info = blocksObj[data.componentType as keyof typeof blocksObj];
    this.props = data.props;
    this.primaryValue.value = data.primaryValue;
    this.content = getContent(this);
  }
}

blockCtors["ComponentBlock"] = ComponentBlock;

export function isComponentBlock(block: any): block is ComponentBlock {
  return Boolean(block.isComponentBlock);
}
