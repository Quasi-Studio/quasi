import { defineStyles, makeResetStyles } from '@refina/griffel'

const rootClassName = makeResetStyles({
  width: 'max-content',
  height: 'max-content',
})

export default () =>
  defineStyles({
    root: [rootClassName],
  })
