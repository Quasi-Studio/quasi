import { Props } from "../../utils/props";
import { ComponentBlock } from "./block";

let v = "";

export function getProps(block: ComponentBlock): Props {
  const { info } = block;

  return Object.fromEntries(
    Object.entries(info.props).map(([k, { type, defaultVal }]) => [
      k,
      {
        type,
        getVal: () => {
          return block.props[k] ?? defaultVal;
        },
        setVal: (val: any) => {
          block.props[k] = val;
        },
      },
    ]),
  );
}
