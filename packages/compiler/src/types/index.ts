import type { ComponentBlockOutput } from './componentBlock'
import type { SpecialBlockOutput } from './specialBlock'

export * from './base'
export * from './componentBlock'
export * from './specialBlock'

export interface ViewOutput {
  name: string
  componentBlocks: ComponentBlockOutput[]
  specialBlocks: SpecialBlockOutput[]
}

export interface QuasiOutput {
  views: ViewOutput[]
}
