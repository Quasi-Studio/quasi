import { MainElRef, byProp, bySelf, ref, view } from "refina";
import { getSelectedProps } from "../utils/props";

export default view(_ => {
  const props = getSelectedProps();
  _.for(props, byProp("name"), p => {
    const r = ref() as MainElRef;
    _.$cls`col-span-1 flex justify-center items-center border-b border-gray-500 h-8`;
    _._div(
      {
        onclick: () => {
          (r.current!.$mainEl!.firstChild! as HTMLInputElement).focus();
        },
      },
      p.name,
    );
    _.$cls`col-span-2 h-8`;
    _.$ref(r);
    if (p.type === "text") {
      _.fUnderlineTextInput(p.getVal(), false, "unset") && p.setVal(_.$ev);
    } else if (p.type === "switch") {
      _.fSwitch("", p.getVal()) && p.setVal(_.$ev);
    } else if (p.type === "dropdown") {
      if (_.fUnderlineDropdown(p.getVal(), p.options)) {
        p.setVal(_.$ev);
      }
    } else if (p.type === "readonly") {
      _.$cls`w-full border-b border-gray-500 flex items-center pl-2`;
      _.div(p.getVal());
    }
  });

  if (props.length === 0) {
    _.$cls`italic ml-4 mt-1 whitespace-nowrap`;
    _.span("No properties");
  }
});
