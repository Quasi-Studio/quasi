import { defineStyles, makeResetStyles, mergeClasses } from "@refina/griffel";

const contentOuterWrapperClassName = makeResetStyles({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  left: 0,
  top: 0,
  boxSizing: "border-box",
});

const contentInnerWrapperClassName = makeResetStyles({
  flexGrow: 0,
  flexShrink: 0,
  width: "max-content",
  height: "max-content",
  transformOrigin: "center left",
});

export default () =>
  defineStyles({
    contentOuterWrapper: [contentOuterWrapperClassName],
    contentInnerWrapper: [contentInnerWrapperClassName],
  });
