import {
  makeResetStyles,
  mergeClasses
} from "@refina/griffel";

const rootClassName = makeResetStyles({
  width: "100%",
  height: "100%",
});

const svgClassName = makeResetStyles({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
});

export default {
  root: mergeClasses(rootClassName),
  svg: mergeClasses(svgClassName),
};
