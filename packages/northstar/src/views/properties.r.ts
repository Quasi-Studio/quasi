import { MainElRef, bySelf, ref, view } from "refina";
import { getSelectedProps } from "../utils/props";

export default view(_ => {
  const props = getSelectedProps();
  _.for(Object.keys(props), bySelf, k => {
    const v = props[k];
    const r = ref() as MainElRef;
    _.$cls`col-span-1 flex justify-center items-center border-b border-gray-500 cursor-text h-8`;
    _._div(
      {
        onclick: () => {
          (r.current!.$mainEl!.firstChild! as HTMLInputElement).focus();
        },
      },
      k,
    );
    _.$cls`col-span-2 cursor-text h-8`;
    _.$ref(r);
    if (v.type === "text") {
      _.fUnderlineTextInput(v.getVal(), false, "unset") && v.setVal(_.$ev);
    } else if (v.type === "switch") {
      _.fSwitch("", v.getVal()) && v.setVal(_.$ev);
    } 
  });
});
