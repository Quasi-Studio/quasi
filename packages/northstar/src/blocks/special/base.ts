import type { PropsData } from '../../utils/props'

export interface SpecialBlock {
  getProps: () => PropsData
  toOutput: () => any
}
