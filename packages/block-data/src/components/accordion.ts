import { ComponentInfo, content, input } from "../types";

export const accordion = {
  kind: "trigger",
  params: [
    {
      name: "title",
      type: content,
    },
    {
      name: "panel",
      type: content,
    },
    {
      name: "disabled",
      type: input("boolean"),
      optional: true,
    },
  ],
} satisfies ComponentInfo as ComponentInfo;
