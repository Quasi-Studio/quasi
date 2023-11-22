import { directionNameMap, directionMap } from "@quasi-dev/visual-flow";
import { PropData, PropsData } from "../../utils/props";
import { ComponentBlock } from "./block";

export function getProps(block: ComponentBlock): PropsData {
  const { info } = block;

  const slotPos: PropData[] = [];
  const primaryInputInfo = block.primaryInputInfo;
  if (primaryInputInfo) {
    slotPos.push({
      key: "slots-pos",
      displayName: "slots pos",
      type: "dropdown",
      options: ["TOP", "BOTTOM"],
      getVal: () => {
        return directionNameMap[block.slotsDirection];
      },
      setVal: (val) => {
        block.slotsDirection = directionMap[val];
      },
    });
  }

  return [
    ...slotPos,
    ...Object.entries(info.props).map(
      ([k, v]) =>
        ({
          ...v,
          key: k,
          getVal:
            v.type === "readonly"
              ? () => v.value
              : () => {
                  return block.props[k] ?? v.defaultVal;
                },
          setVal: (val: any) => {
            block.props[k] = val;
          },
        }) as PropData,
    ),
    ...Object.entries({
      ...info.contents,
      ...info.inputs,
      ...info.outputs,
      ...info.events,
      ...info.methods,
    })
      .filter(
        ([k, v]) =>
          v.mode === "as-hidable-socket" || v.mode === "as-hidden-socket",
      )
      .map(
        ([k, v]) =>
          ({
            key: `[${k}]`,
            displayName: `[${v.displayName}]`,
            type: "switch",
            getVal: () => {
              return block.props[`[${k}]`] ?? v.mode === "as-hidable-socket";
            },
            setVal: (val: any) => {
              block.props[`[${k}]`] = val;
            },
          }) as PropData,
      ),
  ];
}
