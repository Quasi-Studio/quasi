import type { Plugin } from 'refina'
import * as c from './view'

export default {
  name: 'visual-flow',
  components: {
    vfBlock: c.VfBlock,
    vfCreator: c.VfCreator,
    vfGraph: c.VfGraph,
    vfLine: c.VfLine,
    vfSocket: c.VfSocket,
  },
} satisfies Plugin

export * from './components'
export * from './model'
export * from './recorder'
export * from './types'
export * from './view'
