import Monaco from '@quasi-dev/monaco-editor'
import Vf from '@quasi-dev/visual-flow'
import Basics from '@refina/basic-components'
import FluentUI from '@refina/fluentui'
import { $app } from 'refina'
import {
  currentProject,
  loadAutoSaved,
  saveAs,
  setAutoSaveInterval,
} from './project'
import {
  duplicateBlocks,
  hasBlocksToDuplicate,
  hasBlocksToRemove,
  initMonaco,
  removeBlocks,
} from './utils'
import blocksView from './views/blocks.r'
import previewView from './views/preview.r'
import propertiesView from './views/properties.r'
import toolbarView, { graphElRef, previewMode } from './views/toolbar.r'

document.body.spellcheck = false

loadAutoSaved()
setAutoSaveInterval()
initMonaco()

declare module 'refina' {
  interface Plugins {
    VisualFlow: typeof Vf
    Basics: typeof Basics
    FluentUI: ReturnType<typeof FluentUI>
    Monaco: typeof Monaco
  }
}

export const app = $app(
  {
    plugins: [FluentUI(), Vf, Basics, Monaco],
  },
  _ => {
    if (_.$updateContext)
      _.$root.addCls(`fixed top-0 left-0 right-0 bottom-0`)

    _.documentTitle('Quasi Studio')

    // toolbar
    _.$cls`absolute left-0 top-0 w-full h-8 bg-gray-100 flex select-none z-[1000] border-gray-400 border-b`
    _.div(toolbarView)

    if (previewMode.value) {
      _.$cls`absolute left-0 bottom-0 right-0 top-8 ${
        previewMode.value ? '' : 'hidden'
      }`
      _.div(previewView)
    }

    if (!previewMode.value) {
      _.div(_ => {
        const hasSelectedBlock
          = currentProject.activeGraph.selectedBlocks.size > 0

        _.$cls`absolute left-0 top-8 w-80 bottom-0
   bg-gray-200 select-none z-[1000] border-r border-gray-400 flex flex-col`
        _.div(_ => {
          _.$cls`flex items-center w-full bg-gray-300 pl-2 leading-7 font-bold`
          _.div('BLOCKS')

          _.$cls`overflow-y-scroll flex-grow w-full pb-16`
          _.div(blocksView)

          if (hasSelectedBlock) {
          // _.$cls`absolute left-0 bottom-0 w-80 h-2/5 border-t-4 border-gray-400 border-r border-gray-400 z-[1000]`;
          // _.div(_ => {
            _.$cls`flex items-center w-full bg-gray-300 pl-2 leading-7`
            _.div(_ => {
              _.$cls`font-bold`
              _.span('PROPERTIES')

            // _.$cls`text-xs pl-3`;
            // _.span(
            //   [...currentProject.activeGraph.selectedBlocks]
            //     .filter(isComponentBlock)
            //     .map(b => b.info.name)
            //     .join(" "),
            // );
            })

            _.$cls`overflow-y-scroll h-min min-h-[60px] bg-gray-200 grid grid-cols-3 pb-8`
            _.div(propertiesView)
          // });
          }
        })

        _.$cls`absolute left-80 top-8 right-0 bottom-0`
        _.$ref(graphElRef)
        && _._div({}, _ => _.vfGraph(currentProject.activeGraph))

        if (_.$updateContext) {
          _.$window.addEventListener('keydown', (ev: KeyboardEvent) => {
            if (ev.ctrlKey) {
              if (ev.key === 'z' && currentProject.activeGraph.canUndo) {
                currentProject.activeGraph.undo()
                app.update()
              }
              else if (ev.key === 'y' && currentProject.activeGraph.canRedo) {
                currentProject.activeGraph.redo()
                app.update()
              }
              else if (ev.key === 's') {
                saveAs()
              }
              else if (ev.key === 'd' && hasBlocksToDuplicate()) {
                duplicateBlocks()
                app.update()
              }
              ev.preventDefault()
            }
            else if (ev.key === 'Delete') {
              if (hasBlocksToRemove()) {
                removeBlocks()
                app.update()
              }
              ev.preventDefault()
            }
          })
        }

        // a workaround to update the position of the graph
        setTimeout(() => currentProject.activeGraph.updatePosition())
      })
    }
  },
)
