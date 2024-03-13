import type { Plugin } from 'refina'
import MdUI from '@refina/mdui'
import * as c from './components'

export default [
  MdUI as Plugin,
  {
    name: 'quasi-runtime',
    components: {
      qAppLayout: c.QAppLayout,
      qButton: c.QButton,
      qCard: c.QCard,
      qDiv: c.QDiv,
      qForEach: c.QForEach,
      qIfElse: c.QIfElse,
      qInput: c.QInput,
      qList: c.QList,
      qParagraph: c.QParagraph,
      qSpan: c.QSpan,
      qSubPage: c.QSubPage,
      qTable: c.QTable,
      qTableCol: c.QTableCol,
      qTextNode: c.QTextNode,
    },
  } satisfies Plugin,
]

export * as refina from 'refina'
export * from './components'
export * from './types'
