import { Prop, Props } from "../../utils/props";
import { ComponentBlock } from "./block";

let v = "";

export function getProps(block: ComponentBlock): Props {
  const { info } = block;

  return Object.fromEntries(
    Object.entries(info.props).map(([k, v]) => [
      k,
      {
        ...v,
        getVal: () => {
          return block.props[k] ?? v.defaultVal;
        },
        setVal: (val: any) => {
          block.props[k] = val;
        },
      } as Prop,
    ]),
  );
}
