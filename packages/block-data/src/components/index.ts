import {
  component,
  content,
  event,
  input,
  output,
  outputWrap,
  plugin,
  t,
} from "../types";

export const button = component(
  "Button",
  content("inner", "as-primary-and-socket"),
  event("click", "void"),
);

export const p = outputWrap("Paragraph");

export const div = outputWrap("Div");

export const span = outputWrap("Span");

export const textInput = component(
  "Text input",
  [],
  event("input", t.string),
  input("label", "string", "as-primary"),
  output("value", "string"),
  plugin("validator", "#input-validator"),
);
