import { makeResetStyles, mergeClasses } from "@refina/griffel";

const gridStyles = makeResetStyles({
  display: "grid",
  gridTemplateColumns: "3fr 5fr 2fr",
  gridTemplateRows: "1fr 1fr",
  gridColumnGap: "10px",
  gridRowGap: "10px",
  gridAutoFlow: "column",
});

const fullSize = makeResetStyles({
  position: "fixed",
  width: "100%",
  height: "100%",
});

const border = makeResetStyles({
  border: "1px solid #000",
});

export default {
  root: mergeClasses(gridStyles, fullSize),
  toolbar: mergeClasses(border),
  attribute: mergeClasses(border),
  visual_flow: mergeClasses(border)
};
