import { makeResetStyles, makeStyles, mergeClasses } from "@refina/griffel";

const gridStyles = makeResetStyles({
  display: "grid",
  gridTemplateColumns: "1fr 3fr",
  gridTemplateRows: "1fr 19fr",
  gridColumnGap: "10px",
  gridRowGap: "10px",
  gridAutoFlow: "row",
});

const rootStyle = makeResetStyles({
  position: "fixed",
  width: "100%",
  height: "100%",
});

const toolbarStyle = makeResetStyles({
  gridColumn: "1 / 3",
})

const border = makeResetStyles({
  border: "1px solid #000",
});

export default {
  root: mergeClasses(gridStyles, rootStyle),
  toolbar: mergeClasses(border, toolbarStyle),
  block: mergeClasses(border),
  visual_flow: mergeClasses(border)
};
