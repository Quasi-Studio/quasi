import { Props } from "../../utils/props";
import { ComponentBlock } from "./block";

let v = "";

export function getProps(block: ComponentBlock): Props {
  const { info } = block;

  return {
    text: {
      type: "text",
      getVal() {
        return v;
      },
      setVal(val) {
        v = val;
      },
    },
  };
}
