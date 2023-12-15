import * as monaco from "monaco-editor";
import { HTMLElementComponent, ref } from "refina";
import Monaco from "./plugin";

declare module "refina" {
  interface Components {
    monacoEditor(
      initialValue: string,
      language: string,
      options?: Omit<
        monaco.editor.IStandaloneEditorConstructionOptions,
        "value" | "language"
      >,
    ): this is {
      $ev: string;
    };
  }
}
Monaco.triggerComponents.monacoEditor = function (_) {
  const containerRef = ref<HTMLElementComponent<"div">>();
  let editor: monaco.editor.IStandaloneCodeEditor | null = null;
  return (
    initialValue: string,
    language: string,
    options: Omit<
      monaco.editor.IStandaloneEditorConstructionOptions,
      "value" | "language"
    > = {},
  ) => {
    _.$css`height:100%`;
    _.$ref(containerRef) && _._div();

    if (_.$updateContext) {
      _.$app.pushOnetimeHook("afterModifyDOM", () => {
        setTimeout(() => {
          if (!editor) {
            const node = containerRef.current!.node;

            editor = monaco.editor.create(node, {
              ...options,
              value: initialValue,
              language,
            });

            editor.getModel()?.onDidChangeContent(ev => {
              const newValue = editor!.getValue();
              this.$fire(newValue);
            });

            const parent = node.parentElement!;

            if (_.$updateContext)
              window.addEventListener("resize", () => {
                // make editor as small as possible
                editor!.layout({ width: 0, height: 0 });

                // wait for next frame to ensure last layout finished
                window.requestAnimationFrame(() => {
                  // get the parent dimensions and re-layout the editor
                  const rect = parent.getBoundingClientRect();
                  editor!.layout({
                    width: rect.width,
                    height: rect.height,
                  });
                });
              });
          }
        });
      });
    }
  };
};
