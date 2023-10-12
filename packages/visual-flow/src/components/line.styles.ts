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
  notDragging: {
    ":hover": {
      stroke: tokens.colorCompoundBrandStrokeHover,
    },
  },
});

export default {
  root: (dragging: boolean) =>
    mergeClasses(
      rootClassName,
      dragging ? rootStyles.dragging : rootStyles.notDragging,
    ),
};
