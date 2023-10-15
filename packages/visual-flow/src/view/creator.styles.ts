import { makeResetStyles, mergeClasses } from "@refina/griffel";

const rootClassName = makeResetStyles({
  width: "max-content",
  height: "max-content",
});

export default {
  root: mergeClasses(rootClassName),
};
