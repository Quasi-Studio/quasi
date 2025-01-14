import * as monaco from 'monaco-editor'
import type { HTMLElementComponent } from 'refina'
import { TriggerComponent, _, ref } from 'refina'

export class MonacoEditor extends TriggerComponent {
  containerRef = ref<HTMLElementComponent<'div'>>()
  editor: monaco.editor.IStandaloneCodeEditor | null = null
  $main(
    initialValue: string,
    language: string,
    options?: Omit<
      monaco.editor.IStandaloneEditorConstructionOptions,
      'value' | 'language'
    >,
  ): this is {
    $ev: string
  } {
    _.$css`height:100%`
    _.$ref(this.containerRef) && _._div()

    if (_.$updateContext) {
      _.$app.pushOnetimeHook('afterModifyDOM', () => {
        setTimeout(() => {
          if (!this.editor) {
            const node = this.containerRef.current!.node

            this.editor = monaco.editor.create(node, {
              ...options,
              value: initialValue,
              language,
            })

            this.editor.getModel()?.onDidChangeContent(() => {
              const newValue = this.editor!.getValue()
              this.$fire(newValue)
            })

            const parent = node.parentElement!

            if (_.$updateContext) {
              window.addEventListener('resize', () => {
              // make editor as small as possible
                this.editor!.layout({ width: 0, height: 0 })

                // wait for next frame to ensure last layout finished
                window.requestAnimationFrame(() => {
                // get the parent dimensions and re-layout the editor
                  const rect = parent.getBoundingClientRect()
                  this.editor!.layout({
                    width: rect.width,
                    height: rect.height,
                  })
                })
              })
            }
          }
        })
      })
    }
    return this.$fired
  }
}
