import { DoBlock } from './do.r'
import { ExprBlock } from './expr'
import { IfElseBlock } from './if.r'
import { ImpBlock } from './imp'
import { StateBlock } from './state'
import { StateSetterBlock } from './stateSetter.r'
import { StringBlock } from './string'
import { ValidatorBlock } from './validator'

export default Object.entries({
  // root: RootBlock,
  'string': StringBlock,
  'expr': ExprBlock,
  'if-else': IfElseBlock,
  'imperative': ImpBlock,
  'validator': ValidatorBlock,
  'state': StateBlock,
  'stateSetter': StateSetterBlock,
  'do': DoBlock,
})
