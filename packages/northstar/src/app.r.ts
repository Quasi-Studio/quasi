import { app } from "refina";
import FluentUI from "@refina/fluentui";
import layout from "./layout/layout.r";
import toolbar from "./views/toolbar.r";
import attribute from "./views/attribute.r";
import mock from "./views/mock.r";

app.use(FluentUI)((_) => {
  _.embed(layout(toolbar, attribute, mock));
});
