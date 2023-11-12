import { PropData, PropsData } from "../../utils/props";
import { ComponentBlock } from "./block";

export function getProps(block: ComponentBlock): PropsData {
  const { info } = block;

  return [
    ...info.props.map(
      (v) =>
        ({
          ...v,
          getVal:
            v.type === "readonly"
              ? () => v.value
              : () => {
                  return block.props[v.name] ?? v.defaultVal;
                },
          setVal: (val: any) => {
            block.props[v.name] = val;
          },
        }) as PropData,
    ),
    ...[
      ...info.contents,
      ...info.inputs,
      ...info.outputs,
      ...info.events,
      ...info.methods,
    ]
      .filter(
        (v) => v.kind === "as-hidable-socket" || v.kind === "as-hidden-socket",
      )
      .map(
        (v) =>
          ({
            name: `[${v.name}]`,
            type: "switch",
            getVal: () => {
              return (
                block.props[`[${v.name}]`] ??
                v.kind === "as-hidable-socket"
              );
            },
            setVal: (val: any) => {
              block.props[`[${v.name}]`] = val;
            },
          }) as PropData,
      ),
  ];
}
