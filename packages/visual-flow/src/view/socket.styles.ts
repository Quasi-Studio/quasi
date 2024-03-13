import { tokens } from "@fluentui/tokens";
import { defineStyles, makeResetStyles, makeStyles } from "@refina/griffel";

const rootClassName = makeResetStyles({
  fill: tokens.colorBrandForegroundInverted,
});

const rootStyles = makeStyles({
  disabled: { fill: tokens.colorNeutralForegroundDisabled },
  notDisabled: {
    "&.hovered *": {
      fill: tokens.colorCompoundBrandBackgroundHover,
    },
  },
});

const labelClassName = makeResetStyles({
  fontSize: tokens.fontSizeBase200,
  fontWeight: tokens.fontWeightMedium,
  alignmentBaseline: "text-after-edge",
});

const labelStyles = makeStyles({
  disabled: { fill: tokens.colorNeutralForegroundDisabled },
});

export default (disabled: boolean) =>
  defineStyles({
    root: [
      rootClassName,
      disabled ? rootStyles.disabled : rootStyles.notDisabled,
    ],
    label: [labelClassName, disabled && labelStyles.disabled],
  });
