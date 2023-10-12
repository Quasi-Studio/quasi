import {
  makeResetStyles,
  makeStyles,
  mergeClasses,
  shorthands,
} from "@refina/griffel";
import { tokens, typographyStyles } from "@fluentui/tokens";

const rootClassName = makeResetStyles({
  fill: tokens.colorBrandForegroundInverted,

  "&.hovered":{
    fill: tokens.colorCompoundBrandBackgroundHover,
  }
});

export default {
  root: mergeClasses(rootClassName),
};
