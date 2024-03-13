import type {
  ComponentBlockCallbacks,
  ComponentBlockChildren,
  ComponentBlockOutput,
  ComponentBlockPlugins,
  ComponentBlockPrimaryInput,
  ComponentBlockProps,
  ConnectTo,
} from '@quasi-dev/compiler'
import type { Block, SingleOutSocket, Socket } from '@quasi-dev/visual-flow'
import {
  singleInSocketToOutput,
  singleOutSocketToOutput,
} from '../../utils/toOutput'
import type { ValidatorBlock } from '../special/validator'
import type { ComponentBlock } from './block'

export function toBlockOutput(block: ComponentBlock) {
  const blockContents = Object.entries(block.info.contents)
  const blockEvents = Object.entries(block.info.events)
  const blockInputs = Object.entries(block.info.inputs)
  const blockProps = Object.entries(block.info.props)
  const blockPlugins = Object.entries(block.info.plugins)

  const callbacks = {} as ComponentBlockCallbacks
  for (const [k] of blockEvents) {
    callbacks[k] = singleOutSocketToOutput(
      block.getSocketByName(k) as SingleOutSocket,
    )
  }

  const props = {} as ComponentBlockProps
  for (const [k, v] of blockProps) {
    if (v.type !== 'readonly')
      props[k] = block.props[k]
  }
  for (const [k, v] of blockInputs) {
    if (
      v.mode === 'as-primary'
      || (v.mode === 'as-primary-and-socket' && block.primaryFilled)
    )
      continue
    const socket = block.getSocketByName(k)?.allConnectedLines[0]?.a
    props[k] = {
      blockId: socket?.block.id ?? Number.NaN,
      socketName: socket?.label ?? '',
    }
  }

  const children = {} as ComponentBlockChildren
  for (const [k, v] of blockContents) {
    if (
      v.mode === 'as-primary'
      || (v.mode === 'as-primary-and-socket' && block.primaryFilled)
    )
      continue
    children[k]
      = block
        .getSocketByName(k)
        ?.allConnectedLines.map(l => (l.b as Socket).block)
        .sort((a, b) => a.boardY - b.boardY)
        .map(b => b.id) ?? []
  }

  const plugins = {} as ComponentBlockPlugins
  for (const [k, v] of blockPlugins) {
    if (v.kind !== 'input-plugin')
      continue

    const validators: ValidatorBlock[] = []
    let currentPluginBlock: Block | undefined = block
    while (true) {
      currentPluginBlock = currentPluginBlock.dockedByBlocks.find(
        ([d]) => d === v.direction,
      )?.[1]
      if (!currentPluginBlock)
        break

      if ((currentPluginBlock as ValidatorBlock).type === 'validator')
        validators.push(currentPluginBlock as ValidatorBlock)
      else
        throw new Error(`Invalid plugin block ${currentPluginBlock.id}`)
    }

    plugins[k] = `$ => {
      ${validators
        .map(v => {
          if (v.inputValue.value.length === 0)
            throw new Error('Validator expression is empty')
          return `if(!(${v.inputValue})) return "${v.errorMessages}";`
        })
        .join('\n')}
      return true;
    }`
  }

  let primaryInput: ComponentBlockPrimaryInput = null
  const primaryInputInfo = block.primaryInputInfo
  if (primaryInputInfo) {
    const slots: Record<string, ConnectTo> = {}
    for (const socket of block.slotSockets)
      slots[socket.label] = singleInSocketToOutput(socket)

    primaryInput = {
      name: primaryInputInfo[1].displayName,
      value: block.primaryValue.value,
      slots,
    }
  }

  return {
    type: 'component',
    func: block.componentType,
    id: block.id,
    name: block.info.displayName(block.props),
    model: block.info.model,
    callbacks,
    props,
    plugins,
    children,
    primaryInput,
  } satisfies ComponentBlockOutput
}
