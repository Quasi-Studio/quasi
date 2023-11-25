import { makeResetStyles, makeStyles, mergeClasses } from "@refina/griffel";

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

const svgStyles = makeStyles({
  fg: {
    zIndex: 1000,
    pointerEvents: "none",
  },
});

const canvasClassName = makeResetStyles({
  position: "absolute",
  right: "10px",
  bottom: "10px",
  zIndex: 1000,
  backgroundColor: "#eeeeee",
});

export default {
  root: mergeClasses(rootClassName),
  bgSvg: mergeClasses(svgClassName),
  fgSvg: mergeClasses(svgClassName, svgStyles.fg),
  canvas: mergeClasses(canvasClassName),
};
