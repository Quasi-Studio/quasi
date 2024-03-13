export interface PropBase {
  displayName: string
}

export interface TextProp extends PropBase {
  type: 'text'
  defaultVal: string
}
export function textProp(
  displayName: string,
  defaultVal: string = '',
): TextProp {
  return {
    displayName,
    type: 'text',
    defaultVal,
  }
}

export interface SwitchProp extends PropBase {
  type: 'switch'
  defaultVal: boolean
}
export function switchProp(
  displayName: string,
  defaultVal: boolean = false,
): SwitchProp {
  return {
    displayName,
    type: 'switch',
    defaultVal,
  }
}

export interface DropdownProp extends PropBase {
  type: 'dropdown'
  options: string[]
  defaultVal: string
}
export function dropdownProp(
  displayName: string,
  options: string[],
  defaultVal: string,
): DropdownProp {
  return {
    displayName,
    type: 'dropdown',
    options,
    defaultVal,
  }
}

export interface ReadonlyProp extends PropBase {
  type: 'readonly'
  value: string
}
export function readonlyProp(displayName: string, value: string): ReadonlyProp {
  return {
    displayName,
    type: 'readonly',
    value,
  }
}

export interface NumberProp extends PropBase {
  type: 'number'
  defaultVal: number
  min: number
  max: number
}
export function numberProp(
  displayName: string,
  defaultVal: number,
  min: number = Number.NEGATIVE_INFINITY,
  max: number = Number.POSITIVE_INFINITY,
): NumberProp {
  return {
    displayName,
    type: 'number',
    defaultVal,
    min,
    max,
  }
}

export type Prop =
  | TextProp
  | SwitchProp
  | DropdownProp
  | ReadonlyProp
  | NumberProp
