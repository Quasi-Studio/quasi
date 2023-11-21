import { Direction } from "@quasi-dev/visual-flow";
import {
  component,
  content,
  contentWrapper,
  dropdownProp,
  event,
  input,
  layer,
  method,
  output,
  plugin,
  switchProp,
  t,
  textProp,
} from "../types";

export default {
  textNode: component(
    "TextNode",
    null,
    [],
    input("text", "string", "as-primary-and-socket"),
  ),

  button: component(
    "Button",
    null,
    content("inner", "as-primary"),
    input("disabled", t.boolean, "as-hidden-socket"),
    [],
    event("onClick", "void"),
    [],
    [],
    [textProp("class")],
  ),

  p: contentWrapper("Paragraph"),

  div: layer("Div"),

  span: contentWrapper("Span"),

  input: component(
    "TextInput",
    "InputModel",
    [],
    input("label", "string", "as-primary"),
    output("value", "string"),
    event("onInput", t.string, "as-hidden-socket"),
    method("clear", [], "as-hidden-socket"),
    plugin("validator", "input-plugin"),
    [textProp("class"), textProp("initial")],
  ),

  appbar: component(
    "Appbar",
    null,
    content("inner", "as-socket"),
    [],
    [],
    [],
    [],
    [],
    [textProp("class")],
  ),

  list: component(
    "List",
    "ListModel",
    content("inner", "as-socket", Direction.BOTTOM),
    input("data", "iterable"),
    output("current", "unknown", "as-socket", Direction.RIGHT),
    [],
    [],
    [],
    [textProp("class"), textProp("key", "$index")],
  ),

  // table: component(
  //   "Table",
  //   "TableModel",
  //   content("inner", "as-socket", Direction.BOTTOM),
  //   input("data", "iterable"),
  //   [
  //     output("current", "unknown", "as-hidable-socket", Direction.RIGHT),
  //     output("renderingState", "unknown", "as-hidden-socket", Direction.RIGHT),
  //   ],
  //   [],
  //   [],
  //   [],
  //   [textProp("class"), textProp("key", "$index")],
  // ),

  // tableCol: component(
  //   "Table Col",
  //   "TableColModel",
  //   content("inner"),
  //   input("prop", "string", "as-primary"),
  //   output("value", "unknown", "as-hidable-socket", Direction.TOP),
  //   [],
  //   [],
  //   [],
  //   [
  //     textProp("head class"),
  //     textProp("cell class"),
  //     textProp("header", "$prop"),
  //   ],
  // ),

  forEach: component(
    "For each",
    "ForEachModel",
    content("inner", "as-socket", Direction.BOTTOM),
    input("iterable", "iterable"),
    output("current", "unknown", "as-socket", Direction.RIGHT),
  ),

  ifElse: component(
    (props) => (props["[else]"] ? "If else" : "If"),
    null,
    [
      content("then", "as-socket", Direction.RIGHT),
      content("else", "as-hidden-socket", Direction.BOTTOM),
    ],
    input("condition", t.boolean),
  ),
};
