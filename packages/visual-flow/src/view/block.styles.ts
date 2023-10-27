import { tokens, typographyStyles } from "@fluentui/tokens";
import {
  makeResetStyles,
  makeStyles,
  mergeClasses,
  shorthands,
} from "@refina/griffel";

const rootClassName = makeResetStyles({
  position: "fixed",
  width: 0,
  height: 0,
  filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.14))`,
  ...shorthands.overflow("visible"),

  "&.animated": {
    transitionProperty: "all",
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
});

const rootStyles = makeStyles({
  selected: {
    filter: `drop-shadow(0 14px 28px rgba(0,0,0,0.14))`,
  },
  unattached: {
    opacity: 0.4,
  },
  predicting: {
    opacity: 0.4,
  },
});

const svgClassName = makeResetStyles({
  position: "absolute",
  top: 0,
  left: 0,
  ...shorthands.overflow("visible"),
});

const bgClassName = makeResetStyles({
  fill: tokens.colorNeutralBackground5Hover,
  stroke: tokens.colorBrandStroke2,
  strokeWidth: tokens.strokeWidthThick,
});

const bgStyles = makeStyles({
  selected: {
    fill: tokens.colorNeutralBackground5Pressed,
    stroke: tokens.colorBrandStroke2Pressed,
    strokeWidth: tokens.strokeWidthThicker,
  },
  notSelected: {
    "&.hovered": {
      fill: tokens.colorNeutralBackground5,
      stroke: tokens.colorBrandStroke2Hover,
    },
  },
});

const textStyles = makeResetStyles({
  ...typographyStyles.caption1,
});

export default {
  root: (selected: boolean, attached: boolean, predicting: boolean) =>
    mergeClasses(
      rootClassName,
      selected && rootStyles.selected,
      !attached && rootStyles.unattached,
      predicting && rootStyles.predicting,
    ),
  svg: mergeClasses(svgClassName),
  bg: (selected: boolean) =>
    mergeClasses(
      bgClassName,
      selected ? bgStyles.selected : bgStyles.notSelected,
    ),
  text: mergeClasses(textStyles),
};
