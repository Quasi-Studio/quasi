export type BlockCallbacks = Record<
  string,
  {
    blockId: number;
    name: string;
  }[]
>;

export type BlockProps = Record<
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
  callbacks: BlockCallbacks;
  /**
   * 属性，直接作为属性传入
   */
  props: BlockProps;
  /**
   * 子元素的block的id
   */
  children: number[];
}
