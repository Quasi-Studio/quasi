import { makeResetStyles, mergeClasses } from "@refina/griffel";

const gridStyles = makeResetStyles({
  display: "grid",
  gridTemplateColumns: "2fr 5fr 3fr",
  gridTemplateRows: "1fr 1fr",
  gridColumnGap: "10px",
  gridRowGap: "10px",
  gridAutoFlow: "column",
});

const fullSize = makeResetStyles({
  width: "100%",
  height: "100%",
});

const gridFullHeight = makeResetStyles({
  gridRow: "1 / 3",
});

const border = makeResetStyles({
  border: "1px solid #000",
});

export default {
  root: mergeClasses(gridStyles, fullSize),
  toolbar: mergeClasses(border),
  attribute: mergeClasses(border),
  visual_flow: mergeClasses(gridFullHeight, border),
  block: mergeClasses(gridFullHeight, border),
};
