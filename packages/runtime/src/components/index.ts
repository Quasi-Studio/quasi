import qAppLayout from './appLayout.r'
import qButton from './button.r'
import qCard from './card.r'
import qDiv from './div.r'
import qForEach from './forEach.r'
import qIfElse from './ifElse.r'
import qInput from './input.r'
import qList from './list.r'
import qParagraph from './paragraph.r'
import qSpan from './span.r'
import qSubPage from './subPage.r'
import qTable from './table.r'
import qTableItem from './tableItem.r'
import qTextNode from './textNode.r'

export * from './appLayout.r'
export * from './button.r'
export * from './card.r'
export * from './div.r'
export * from './forEach.r'
export * from './ifElse.r'
export * from './input.r'
export * from './list.r'
export * from './paragraph.r'
export * from './span.r'
export * from './subPage.r'
export * from './table.r'
export * from './tableItem.r'
export * from './textNode.r'

export const componentInfoObj = {
  qAppLayout,
  qSubPage,
  qButton,
  qCard,
  qDiv,
  qForEach,
  qIfElse,
  qInput,
  qList,
  qParagraph,
  qSpan,
  qTable,
  qTableItem,
  qTextNode,
}

export const componentInfoArray = Object.entries(componentInfoObj)
