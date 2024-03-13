import { currentProject } from '../project'

export interface PropDataBase {
  key: string
  displayName: string
}

export interface TextPropData extends PropDataBase {
  type: 'text'
  getVal: () => string
  setVal: (val: string) => void
}
export interface SwitchPropData extends PropDataBase {
  type: 'switch'
  getVal: () => boolean
  setVal: (val: boolean) => void
}
export interface DropdownPropData extends PropDataBase {
  type: 'dropdown'
  options: string[]
  getVal: () => string
  setVal: (val: string) => void
}
export interface ReadonlyPropData extends PropDataBase {
  type: 'readonly'
  getVal: () => string
  /**
   * @deprecated
   */
  setVal: (val: string) => void
}
export interface NumberPropData extends PropDataBase {
  type: 'number'
  min: number
  max: number
  getVal: () => number
  setVal: (val: number) => void
}

export type PropData =
  | TextPropData
  | SwitchPropData
  | DropdownPropData
  | ReadonlyPropData
  | NumberPropData
export type PropsData = PropData[]

export function mergeProps([props0, ...propsRest]: PropsData[]) {
  const mergedProps: PropsData = []
  for (const v of props0) {
    if (
      propsRest.every(ps =>
        ps.some(p => p.displayName === v.displayName && p.type === v.type),
      )
    )
      mergedProps.push(v)
  }
  return mergedProps
}

export function getSelectedProps(): PropsData {
  return mergeProps(
    [...currentProject.activeGraph.selectedBlocks].map(
      b => (b as any).getProps?.() ?? [],
    ),
  )
}
