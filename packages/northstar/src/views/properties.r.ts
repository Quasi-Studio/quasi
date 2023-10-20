import { FUnderlineTextInput } from "@refina/fluentui";
import { ref, view } from "refina";

export default view((_) => {
  _.forRange(15, (i) => {
    const r = ref<FUnderlineTextInput>();
    _.$cls`col-span-1 flex justify-center items-center border-b border-gray-500 cursor-text`;
    _._div(
      {
        onclick: () => {
          (r.current!.$mainEl?.firstChild! as HTMLInputElement).focus();
        },
      },
      i,
    );
    _.$cls`col-span-4 cursor-text`;
    _.$ref(r) && _.fUnderlineTextInput("Text input " + i);
  });
});
