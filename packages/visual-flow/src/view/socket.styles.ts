import { tokens } from "@fluentui/tokens";
import { makeResetStyles, makeStyles, mergeClasses } from "@refina/griffel";

const rootClassName = makeResetStyles({
  fill: tokens.colorBrandForegroundInverted,
});

const rootStyles = makeStyles({
  disabled: { fill: tokens.colorNeutralForegroundDisabled },
  notDisabled: {
    "&.hovered path": {
      fill: tokens.colorCompoundBrandBackgroundHover,
    },
  },
});

export default {
  root: (disabled: boolean) =>
    mergeClasses(
      rootClassName,
      disabled ? rootStyles.disabled : rootStyles.notDisabled,
    ),
};
