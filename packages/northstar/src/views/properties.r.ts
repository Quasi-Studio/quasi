import { $clsFunc, MainElRef, byProp, bySelf, ref, view } from "refina";
import { getSelectedProps } from "../utils/props";
import "@refina/fluentui-icons/add.r.ts";
import "@refina/fluentui-icons/subtract.r.ts";

export default view(_ => {
  const props = getSelectedProps();
  _.for(props, byProp("name"), p => {
    const r = ref() as MainElRef;
    _.$cls`col-span-1 flex justify-center items-center border-b border-gray-500 h-8`;
    _._div(
      {
        onclick: () => {
          (r.current?.$mainEl?.firstChild as HTMLElement | null | undefined)?.focus();
        },
      },
      p.name,
    );
    _.$cls`col-span-2 h-8`;
    if (p.type === "text") {
      _.$ref(r);
      _.fUnderlineTextInput(p.getVal(), false, "unset") && p.setVal(_.$ev);
    } else if (p.type === "switch") {
      _.fSwitch("", p.getVal()) && p.setVal(_.$ev);
    } else if (p.type === "dropdown") {
      _.$ref(r);
      if (_.fUnderlineDropdown(p.getVal(), p.options)) {
        p.setVal(_.$ev);
      }
    } else if (p.type === "readonly") {
      _.$cls`w-full border-b border-gray-500 flex items-center pl-2`;
      _.div(p.getVal());
    } else if (p.type === "number") {
      const value = p.getVal();
      _.$cls`w-full grid grid-cols-4 items-center px-2`;
      _.div(() => {
        const btnStyle = $clsFunc`w-5 h-5 p-[2px] box-content font-bold border-2 border-gray-500 rounded hover:border-gray-800 disabled:opacity-50`;

        btnStyle(_);
        _.$cls`justify-self-end`;
        _.button(_ => _.fiSubtract20Filled(), value === p.min) && p.setVal(value - 1);

        _.$cls`col-span-2 pl-2 justify-self-center`;
        _.span(value.toString());

        btnStyle(_);
        _.$cls`justify-self-start`;
        _.button(_ => _.fiAdd20Filled(), value === p.max) && p.setVal(value + 1);
      });
    }
  });

  if (props.length === 0) {
    _.$cls`italic ml-4 mt-1 whitespace-nowrap`;
    _.span("No properties");
  }
});
