import { tokens } from "@fluentui/tokens";
import { makeResetStyles, makeStyles, mergeClasses } from "@refina/griffel";

const colors = {
  default: tokens.colorBrandForegroundInverted,
  dragging: tokens.colorBrandForegroundOnLightPressed,
  hovered: tokens.colorBrandForegroundOnLight,
};

const curveClassName = makeResetStyles({
  stroke: colors.default,
  fill: "none",
});

const curveStyles = makeStyles({
  dragging: {
    stroke: colors.dragging,
    strokeWidth: tokens.strokeWidthThickest,
  },
  predicting: {
    opacity: 0.4,
  },
  hoverable: {
    "&.hovered": {
      stroke: colors.hovered,
    },
  },
});

const arrowClassName = makeResetStyles({
  fill: colors.default,
});

const arrowStyles = makeStyles({
  dragging: {
    fill: colors.dragging,
  },
  predicting: {
    opacity: 0.4,
  },
  hoverable: {
    "&.hovered": {
      fill: colors.hovered,
    },
  },
});

export default {
  curve: (dragging: boolean, predicting: boolean) =>
    mergeClasses(
      curveClassName,
      dragging && curveStyles.dragging,
      predicting && curveStyles.predicting,
      !(dragging || predicting) && curveStyles.hoverable,
    ),
  arrow: (dragging: boolean, predicting: boolean) =>
    mergeClasses(
      arrowClassName,
      dragging && arrowStyles.dragging,
      predicting && arrowStyles.predicting,
      !(dragging || predicting) && arrowStyles.hoverable,
    ),
};
