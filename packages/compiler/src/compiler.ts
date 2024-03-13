import * as prettier from 'prettier'
import BabelPlugin from 'prettier/plugins/babel'

// @ts-expect-error missing type
import EsTreePlugin from 'prettier/plugins/estree'
import { ViewCompiler } from './viewCompiler'
import type { QuasiOutput } from './types'

export class Compiler {
  constructor(public input: QuasiOutput) {}

  runtimeModuleURL = '@quasi-dev/runtime'

  async compile() {
    const code = `
import QuasiRuntime, * as $quasi from "${this.runtimeModuleURL}";

const { $app, $view } = $quasi.refina;

${this.input.views
  .map(v => {
    const viewCompiler = new ViewCompiler(this, v)
    return viewCompiler.compile()
  })
  .join('\n\n')}
`
    return await prettier.format(code, {
      parser: 'babel',
      plugins: [BabelPlugin, EsTreePlugin],
      arrowParens: 'avoid',
    })
  }
}
