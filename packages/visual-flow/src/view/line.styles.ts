import { tokens } from '@fluentui/tokens'
import {
  defineStyles,
  makeResetStyles,
  makeStyles,
} from '@refina/griffel'

const curveClassName = makeResetStyles({
  fill: 'none',
})

const curveStyles = makeStyles({
  dragging: {
    strokeWidth: tokens.strokeWidthThickest,
  },
  predicting: {
    opacity: 0.4,
  },
})

const arrowClassName = makeResetStyles({})

const arrowStyles = makeStyles({
  dragging: {},
  predicting: {
    opacity: 0.4,
  },
})

export default (dragging: boolean, predicting: boolean) =>
  defineStyles({
    curve: [
      curveClassName,
      dragging && curveStyles.dragging,
      predicting && curveStyles.predicting,
    ],
    arrow: [
      arrowClassName,
      dragging && arrowStyles.dragging,
      predicting && arrowStyles.predicting,
    ],
  })
