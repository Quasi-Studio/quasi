import { tokens } from "@fluentui/tokens";
import { makeResetStyles, makeStyles, mergeClasses } from "@refina/griffel";

const curveClassName = makeResetStyles({
  fill: "none",
});

const curveStyles = makeStyles({
  dragging: {
    strokeWidth: tokens.strokeWidthThickest,
  },
  predicting: {
    opacity: 0.4,
  },
});

const arrowClassName = makeResetStyles({});

const arrowStyles = makeStyles({
  dragging: {},
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
