import { ComponentInfo, input, output } from "../types";

export const textInput = {
  displayName: "Text Input",
  kind: "trigger",
  params: [
    {
      name: "value",
      type: output("string"),
    },
    {
      name: "disabled",
      type: input("boolean"),
      optional: true,
    },
    {
      name: "placeholder",
      type: input("string"),
      optional: true,
    },
  ],
} satisfies ComponentInfo;
