import { tokens } from "@fluentui/tokens";
import { makeResetStyles, mergeClasses } from "@refina/griffel";

const contentOuterWrapperClassName = makeResetStyles({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  left: 0,
  top: 0,
  padding: tokens.spacingHorizontalS,
  boxSizing: "border-box",
});

const contentInnerWrapperClassName = makeResetStyles({
  flexGrow: 0,
  flexShrink: 0,
  width: "max-content",
  height: "max-content",
});

export default {
  contentOuterWrapper: mergeClasses(contentOuterWrapperClassName),
  contentInnerWrapper: mergeClasses(contentInnerWrapperClassName),
};
