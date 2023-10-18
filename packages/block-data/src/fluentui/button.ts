import { ComponentInfo, content, input } from "../types";

export const button = {
  kind: "trigger",
  params: [
    {
      name: "inner",
      type: content,
    },
    {
      name: "disabled",
      type: input("boolean"),
      optional: true,
    },
  ],
} satisfies ComponentInfo;
