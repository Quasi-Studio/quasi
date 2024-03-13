import * as monaco from 'monaco-editor'
import type { Plugin } from 'refina'
import { MonacoEditor } from './component.r'

export default {
  name: 'monaco-editor',
  components: {
    monacoEditor: MonacoEditor,
  },
} satisfies Plugin

export * from './component.r'
export { monaco }
