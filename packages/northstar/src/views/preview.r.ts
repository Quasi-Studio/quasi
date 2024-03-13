/// <reference types="vite/client" />

import { compileTailwindCSS } from '@quasi-dev/browser-tailwind'
import { Compiler } from '@quasi-dev/compiler'
import { transformFragment } from '@refina/transformer'
import type { HTMLElementComponent } from 'refina'
import { $view, ref } from 'refina'

import runtimeURL from '@quasi-dev/runtime/src/index.ts?url'

import mduiStyleContent from '@quasi-dev/runtime/styles.css?inline'

// Used in production
import mduiStyleUrl from '@quasi-dev/runtime/styles.css?url'
import { currentProject } from '../project'

// Used in development
import { app } from '../app.r'
import iframeURL from './iframe/index.html?url'

const code = {
  js: '',
  css: '',
}
let codeModified = true
let errorReported = false
const iframe = ref<HTMLElementComponent<'iframe'>>()
let errorMsg = ''

export async function startPreview() {
  const compiler = new Compiler(currentProject.toOutput())
  compiler.runtimeModuleURL = runtimeURL
  code.js
    = `window.__QUASI_PREVIEW__ = true; \n\n${
     transformFragment(await compiler.compile(), idx => idx.toString(36))}`
  code.css = (
    await compileTailwindCSS(
      `@tailwind base;
  @tailwind components;
  @tailwind utilities;`,
      code.js,
      'js',
    )
  ).css
  codeModified = true
  errorReported = false
  errorMsg = ''
}

export default $view(_ => {
  if (errorMsg.length > 0) {
    _.$cls`text-red-900 border border-red-500`
    _._pre({}, errorMsg)
  }

  _.$ref(iframe)
  && _._iframe({
    // src: iframeURL,
    frameBorder: '0',
    width: '100%',
    height: '100%',
  })

  _.$updateContext
  && _.$app.pushOnetimeHook('afterModifyDOM', () => {
    if (!_.$updateContext || !codeModified)
      return
    codeModified = false
    const iframeNode = iframe.current!.node

    iframeNode.src = iframeURL
    iframeNode.onload = () => {
      if (errorMsg !== '') {
        errorMsg = ''
        app.update()
      }

      iframeNode.contentWindow!.onerror = (
        event: Event | string,
        source?: string,
        lineno?: number,
        colno?: number,
        error?: Error,
      ) => {
        if (errorReported)
          return

        errorMsg = `ERROR: ${event}

source: ${source}
lineno: ${lineno}
colno: ${colno}
error: ${error}`

        app.update()
        errorReported = true
      }
      // @ts-expect-error missing type
      iframeNode.contentWindow!.console.error = (...args: any[]) => {
        errorMsg += `\nCONSOLE ERROR: \n${args.join(' ')}`
        console.error(...args)
        app.update()
      }

      const scriptNode = iframeNode.contentDocument!.getElementById(
        'app-script',
      ) as HTMLScriptElement
      scriptNode.innerHTML = code.js

      const styleNode = iframeNode.contentDocument!.getElementById(
        'app-style',
      ) as HTMLStyleElement
      styleNode.innerHTML = code.css

      if (import.meta.env.DEV) {
        const styleNode = iframeNode.contentDocument!.getElementById(
          'mdui-style-dev',
        ) as HTMLLinkElement
        styleNode.href = mduiStyleUrl
      }
      else {
        const styleNode = iframeNode.contentDocument!.getElementById(
          'mdui-style',
        ) as HTMLStyleElement
        styleNode.innerHTML = mduiStyleContent
      }
    }
  })
})
