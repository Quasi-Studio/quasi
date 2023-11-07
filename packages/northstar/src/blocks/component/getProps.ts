import { PropData, PropsData } from "../../utils/props";
import { ComponentBlock } from "./block";

export function getProps(block: ComponentBlock): PropsData {
  const { info } = block;

  return info.props.map(
    (v) =>
      ({
        ...v,
        getVal: () => {
          return block.props[v.name] ?? v.defaultVal;
        },
        setVal: (val: any) => {
          block.props[v.name] = val;
        },
      }) as PropData,
  );
}
