import * as monaco from "monaco-editor";
import { ComponentContext, D, HTMLElementComponent, TriggerComponent, getD, ref } from "refina";
import Monaco from "./plugin";

@Monaco.triggerComponent("monacoEditor")
export class MonacoEditor extends TriggerComponent<string> {
  containerRef = ref<HTMLElementComponent<"div">>();
  // overflowRef = ref<HTMLElementComponent<"div">>();
  editor: monaco.editor.IStandaloneCodeEditor | null = null;
  main(
    _: ComponentContext<this>,
    initialValue: string,
    language: string,
    options: Omit<
      monaco.editor.IStandaloneEditorConstructionOptions,
      "value" | "language" | "overflowWidgetsDomNode"
    > = {},
  ): void {
    _.$css`height:100%`;
    _.$ref(this.containerRef) && _._div();

    // _.portal(_ => {
    //   _.$ref(this.overflowRef) && _._div();
    // });

    if (_.$updating) {
      _.$app.pushHook("afterModifyDOM", () => {
        setTimeout(() => {
          if (!this.editor) {
            const node = this.containerRef.current!.node;

            this.editor = monaco.editor.create(node, {
              ...options,
              value: initialValue,
              language,
              // overflowWidgetsDomNode: this.overflowRef.current!.node,
            });

            this.editor.getModel()?.onDidChangeContent(ev => {
              const newValue = this.editor!.getValue();
              this.$fire(newValue);
            });

            const parent = node.parentElement!;

            window.addEventListener("resize", () => {
              // make editor as small as possible
              this.editor!.layout({ width: 0, height: 0 });

              // wait for next frame to ensure last layout finished
              window.requestAnimationFrame(() => {
                // get the parent dimensions and re-layout the editor
                const rect = parent.getBoundingClientRect();
                this.editor!.layout({ width: rect.width, height: rect.height });
              });
            });
          }
        });
      });
    }
  }
}

declare module "refina" {
  interface TriggerComponents {
    monacoEditor: MonacoEditor;
  }
}
