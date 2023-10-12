import { app } from "refina";
import layout from "./layout/layout.r";

app((_) => {
  _.embed(layout);
});
