import { tokens } from "@fluentui/tokens";
import { makeResetStyles, makeStyles, mergeClasses } from "@refina/griffel";

const curveClassName = makeResetStyles({
  stroke: tokens.colorCompoundBrandStroke,
  strokeWidth: tokens.strokeWidthThick,
  fill: "none",
});

const curveStyles = makeStyles({
  dragging: {
    stroke: tokens.colorCompoundBrandStrokePressed,
    strokeWidth: tokens.strokeWidthThickest,
  },
  predicting: {
    opacity: 0.4,
  },
});

const arrowClassName = makeResetStyles({
  fill: tokens.colorCompoundBrandStroke,
});

const arrowStyles = makeStyles({
  dragging: {
    fill: tokens.colorCompoundBrandStrokePressed,
  },
  predicting: {
    opacity: 0.4,
  },
});

export default {
  curve: (dragging: boolean, predicting: boolean) =>
    mergeClasses(
      curveClassName,
      dragging && curveStyles.dragging,
      predicting && curveStyles.predicting,
    ),
  arrow: (dragging: boolean, predicting: boolean) =>
    mergeClasses(
      arrowClassName,
      dragging && arrowStyles.dragging,
      predicting && arrowStyles.predicting,
    ),
};
