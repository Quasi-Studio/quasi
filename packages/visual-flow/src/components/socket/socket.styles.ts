import { tokens } from "@fluentui/tokens";
import {
  makeResetStyles,
  mergeClasses
} from "@refina/griffel";

const rootClassName = makeResetStyles({
  fill: tokens.colorBrandForegroundInverted,

  "&.hovered": {
    fill: tokens.colorCompoundBrandBackgroundHover,
  },
});

export default {
  root: mergeClasses(rootClassName),
};
