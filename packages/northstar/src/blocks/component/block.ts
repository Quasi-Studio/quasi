import { ComponentInfo, componentInfoObj } from "@quasi-dev/runtime";
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

  get primaryInputInfo() {
    return [
      ...Object.entries(this.info.inputs),
      ...Object.entries(this.info.contents),
    ].find(
      ([_, v]) => v.mode === "as-primary" || v.mode === "as-primary-and-socket",
    );
  }

  primaryValue = d("");
  get primaryFilled() {
    return this.primaryValue.value !== "";
  }
  getPrimaryDisabled = () => false;

  slotsDirection = Direction.TOP;
  get slots() {
    const template = this.primaryValue.value;
    const matches = template.matchAll(/\{[a-zA-Z0-9_]+\}/g);
    return [...matches].map((match) => match[0].slice(1, -1));
  }

  get slotSockets() {
    return this.getSocketsByPrefix("slot") as SingleInSocket[];
  }

  socketUpdater(useSocket: UseSocket): void {
    const contents = Object.values(this.info.contents);
    const events = Object.values(this.info.events);
    const inputs = Object.values(this.info.inputs);
    const outputs = Object.values(this.info.outputs);
    const methods = Object.values(this.info.methods);

    useSocket("parent", SingleInSocket, {
      type: "L",
      path: PATH_IN_RECT,
      hideLabel: true,
      direction: Direction.LEFT,
    });

    if (this.primaryInputInfo) {
      for (const slot of this.slots) {
        useSocket(`slot-${slot}`, SingleInSocket, {
          label: slot,
          type: "D",
          path: PATH_IN_ELIPSE,
          direction: this.slotsDirection,
        });
      }
    }

    const shouldHideSocket = (socketInfo: {
      mode: string;
      displayName: string;
    }) => {
      const prop = this.props[`[${socketInfo.displayName}]`];
      return (
        (socketInfo.mode === "as-hidden-socket" && prop !== true) ||
        (socketInfo.mode === "as-hidable-socket" && prop === false) ||
        (socketInfo.mode === "as-primary-and-socket" && this.primaryFilled)
      );
    };

    for (const content of contents) {
      if (content.mode === "as-primary" || shouldHideSocket(content)) continue;
      const socket = useSocket(content.displayName, MultiOutSocket, {
        type: "L",
        path: PATH_OUT_RECT,
        hideLabel: contents.length === 1,
        direction: content.position ?? Direction.RIGHT,
      });

      if (content.mode === "as-primary-and-socket") {
        this.getPrimaryDisabled = () => {
          return socket.allConnectedLines.length > 0;
        };
      }
    }

    for (const event of events) {
      if (shouldHideSocket(event)) continue;
      useSocket(event.displayName, SingleOutSocket, {
        type: "E",
        path: PATH_OUT_TRIANGLE,
        direction: event.position ?? Direction.BOTTOM,
      });
    }

    for (const input of inputs) {
      if (input.mode === "as-primary" || shouldHideSocket(input)) continue;
      const socket = useSocket(input.displayName, SingleInSocket, {
        type: "D",
        path: PATH_IN_ELIPSE,
        direction: input.position ?? Direction.UP,
      });

      if (input.mode === "as-primary-and-socket") {
        this.getPrimaryDisabled = () => {
          return socket.allConnectedLines.length > 0;
        };
      }
    }

    for (const output of outputs) {
      if (shouldHideSocket(output)) continue;
      useSocket(output.displayName, MultiOutSocket, {
        type: "D",
        path: PATH_OUT_ELIPSE,
        direction: output.position ?? Direction.BOTTOM,
      });
    }

    for (const method of methods) {
      if (shouldHideSocket(method)) continue;
      useSocket(method.displayName, MultiInSocket, {
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
      slotsDirection: this.slotsDirection,
    };
  }
  protected importData(data: any, sockets: Record<number, Socket>): void {
    super.importData(data, sockets);
    this.componentType = data.componentType;
    this.info =
      componentInfoObj[data.componentType as keyof typeof componentInfoObj];
    this.props = data.props;
    this.primaryValue.value = data.primaryValue;
    this.slotsDirection = data.slotsDirection;
    this.content = getContent(this);
  }
}

blockCtors["ComponentBlock"] = ComponentBlock;

export function isComponentBlock(block: any): block is ComponentBlock {
  return Boolean(block.isComponentBlock);
}
