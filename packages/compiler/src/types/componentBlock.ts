import { ConnectTo } from "./base";

export type ComponentBlockCallbacks = Record<string, ConnectTo[]>;

export type ComponentBlockProps = Record<string, string | boolean | ConnectTo>;

export type ComponentBlockPlugins = Record<string, string>;

/**
 * Content text or child block id
 */
export type ComponentBlockChildren = Record<string, string | number[]>;

export interface ComponentBlockOutput {
  type: "component";
  id: number;
  /**
   * `_.` + componentType，组件被调用的时候的名字
   */
  func: string;
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
  callbacks: ComponentBlockCallbacks;
  /**
   * 属性，直接作为属性传入
   */
  props: ComponentBlockProps;
  /**
   * 插件，键为插件名，值直接作为代码输出
   */
  plugins: ComponentBlockPlugins;
  /**
   * 子元素的block的id
   */
  children: ComponentBlockChildren;
}
