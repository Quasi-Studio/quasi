import type { ContentInfo } from './content'
import { content } from './content'
import type { EventInfo } from './event'
import type { InputInfo } from './input'
import type { MethodInfo } from './method'
import type { OutputInfo } from './output'
import type { PluginInfo } from './plugin'
import type { Prop } from './prop'
import { textProp } from './prop'

export interface ComponentInfo {
  displayName: (props: Record<string, any>) => string

  blockWidth: number
  blockHeight: number

  model: string | null

  contents: Record<string, ContentInfo>
  inputs: Record<string, InputInfo>
  outputs: Record<string, OutputInfo>
  events: Record<string, EventInfo>
  methods: Record<string, MethodInfo>
  plugins: Record<string, PluginInfo>
  props: Record<string, Prop>
}

export function component(
  info: Partial<Omit<ComponentInfo, 'displayName'>> &
  Pick<ComponentInfo, 'displayName'>,
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
  }
}

export function contentWrapper(name: string) {
  return component({
    displayName: () => name,
    contents: {
      inner: content('inner', 'as-primary'),
    },
    props: {
      class: textProp('class'),
    },
  })
}

export function layer(name: string) {
  return component({
    displayName: () => name,
    contents: {
      inner: content('inner', 'as-primary-and-socket'),
    },
    props: {
      class: textProp('class'),
    },
  })
}
