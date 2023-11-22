import { ContentInfo, content } from "./content";
import { EventInfo } from "./event";
import { InputInfo } from "./input";
import { MethodInfo } from "./method";
import { OutputInfo } from "./output";
import { PluginInfo } from "./plugin";
import { Prop, textProp } from "./prop";

export interface ComponentInfo {
  /**
   * Display name
   */
  displayName: (props: Record<string, any>) => string;

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
