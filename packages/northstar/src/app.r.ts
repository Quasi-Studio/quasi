import { Content, Context, app } from "refina"
import layout from "./layout/layout.r"
import toolbar from "./views/toolbar"
import attribute from "./views/attribute"
import visual_flow from "./views/visual_flow"
import block from "./views/block"

app((_) => {
  _.embed(layout(
    toolbar,
    attribute,
    visual_flow,
    block
  ));
});
