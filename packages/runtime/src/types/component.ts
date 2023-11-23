import { ContentInfo, content } from "./content";
import { EventInfo } from "./event";
import { InputInfo } from "./input";
import { MethodInfo } from "./method";
import { OutputInfo } from "./output";
import { PluginInfo } from "./plugin";
import { Prop, textProp } from "./prop";

export interface ComponentInfo {
  displayName: (props: Record<string, any>) => string;

  blockWidth: number;
  blockHeight: number;

  model: string | null;

  contents: Record<string, ContentInfo>;
  inputs: Record<string, InputInfo>;
  outputs: Record<string, OutputInfo>;
  events: Record<string, EventInfo>;
  methods: Record<string, MethodInfo>;
  plugins: Record<string, PluginInfo>;
  props: Record<string, Prop>;
}

export function component(
  info: Partial<Omit<ComponentInfo, "displayName">> &
    Pick<ComponentInfo, "displayName">,
): ComponentInfo {
  return {
    blockWidth: 200,
    blockHeight: 50,
    model: null,
    contents: {},
    inputs: {},
    outputs: {},
    events: {},
    methods: {},
    plugins: {},
    props: {},
    ...info,
  };
}

export function contentWrapper(name: string) {
  return component({
    displayName: () => name,
    contents: {
      inner: content("inner", "as-primary"),
    },
    props: {
      class: textProp("class"),
    },
  });
}

export function layer(name: string) {
  return component({
    displayName: () => name,
    contents: {
      inner: content("inner", "as-primary-and-socket"),
    },
    props: {
      class: textProp("class"),
    },
  });
}
