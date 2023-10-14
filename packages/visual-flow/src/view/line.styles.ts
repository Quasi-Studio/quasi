import { tokens } from "@fluentui/tokens";
import { makeResetStyles, makeStyles, mergeClasses } from "@refina/griffel";

const rootClassName = makeResetStyles({
  stroke: tokens.colorCompoundBrandStroke,
  strokeWidth: tokens.strokeWidthThick,
  fill: "none",
});

const rootStyles = makeStyles({
  dragging: {
    stroke: tokens.colorCompoundBrandStrokePressed,
    strokeWidth: tokens.strokeWidthThickest,
  },
});

const arrowClassName = makeResetStyles({
  fill: tokens.colorCompoundBrandStroke,
});

const arrowStyles = makeStyles({
  dragging: {
    fill: tokens.colorCompoundBrandStrokePressed,
  },
});

export default {
  root: (dragging: boolean) =>
    mergeClasses(rootClassName, dragging && rootStyles.dragging),
  arrow: (dragging: boolean) =>
    mergeClasses(arrowClassName, dragging && arrowStyles.dragging),
};
