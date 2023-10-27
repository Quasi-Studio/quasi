import { Socket } from "@quasi-dev/visual-flow";
import { ComponentBlock } from "./block";

type Callbacks = Record<
  string,
  {
    blockId: number;
    name: string;
  }[]
>;

type Props = Record<
  string,
  | string
  | boolean
  | {
      blockId: number;
      name: string;
    }
>;

export interface ComponentBlockOutput {
  id: number;
  /**
   * `_.` + componentType，组件被调用的时候的名字
   */
  type: string;
  /**
   * 显示的名称，感觉编译的时候用不到
   */
  name: string;
  /**
   * Model构造器
   * e.g. `new Dialog()`
   */
  modelAllocator: string | null;
  /**
   * 事件回调，生成成函数后作为属性传入
   */
  callbacks: Callbacks;
  /**
   * 属性，直接作为属性传入
   */
  props: Props;
  /**
   * 子元素的block的id
   */
  children: number[];
}

export function toBlockOutput(block: ComponentBlock) {
  const callbacks = {} as Callbacks;
  for (const event of block.info.events) {
    const sockets = block.socketMap
      .get(event.name)
      ?.allConnectedLines?.map((l) => l.b as Socket);
    if (!sockets) continue;

    callbacks[event.name] = [];
    for (const socket of sockets) {
      callbacks[event.name].push({
        blockId: socket.block.id,
        name: socket.label,
      });
    }
  }

  const props = {} as Props;
  for (const [k, v] of Object.entries(block.info.props)) {
    props[k] = block.props[k] ?? v.defaultVal;
  }
  for (const input of block.info.inputs) {
    const socket = block.socketMap.get(input.name)?.allConnectedLines[0]?.a;
    if (!socket) continue;
    props[input.name] = {
      blockId: socket.block.id,
      name: socket.label,
    };
  }

  const children = [] as number[];
  for (const content of block.info.contents) {
    const socket = block.socketMap.get(content.name)?.allConnectedLines[0]?.b;
    if (!socket) continue;
    children.push((socket as Socket).block.id);
  }

  return {
    type: block.componentType,
    id: block.id,
    name: block.info.name,
    modelAllocator: block.info.modelAllocator,
    callbacks,
    props,
    children,
  } satisfies ComponentBlockOutput;
}
