import { tokens, typographyStyles } from '@fluentui/tokens'
import {
  defineStyles,
  makeResetStyles,
  makeStyles,
  shorthands,
} from '@refina/griffel'

export const PADDING_FOR_SOCKETS = 100

const rootClassName = makeResetStyles({
  'position': 'absolute',
  'width': 0,
  'height': 0,
  'filter': `drop-shadow(0 4px 8px rgba(0,0,0,0.14))`,
  'cursor': 'default',
  ...shorthands.overflow('visible'),

  '&.animated': {
    transitionProperty: 'all',
    transitionDuration: tokens.durationNormal,
    transitionTimingFunction: tokens.curveEasyEase,
  },
})

const rootStyles = makeStyles({
  selected: {
    filter: `drop-shadow(0 14px 28px rgba(0,0,0,0.14))`,
  },
  unattached: {
    position: 'fixed',
    opacity: 0.4,
  },
  predicting: {
    opacity: 0.4,
  },
})

const svgClassName = makeResetStyles({
  position: 'absolute',
  pointerEvents: 'none',
  ...shorthands.overflow('visible'),
})

const bgClassName = makeResetStyles({
  fill: tokens.colorNeutralBackground5Hover,
  stroke: tokens.colorBrandStroke2,
  strokeWidth: tokens.strokeWidthThick,
})

const bgStyles = makeStyles({
  selected: {
    fill: tokens.colorNeutralBackground5Pressed,
    stroke: tokens.colorBrandStroke2Pressed,
    strokeWidth: tokens.strokeWidthThicker,
  },
  notSelected: {
    '&.hovered': {
      fill: tokens.colorNeutralBackground5,
      stroke: tokens.colorBrandStroke2Hover,
    },
  },
})

const textStyles = makeResetStyles({
  ...typographyStyles.caption1,
})

export default (selected: boolean, attached: boolean, predicting: boolean) =>
  defineStyles({
    root: [
      rootClassName,
      selected && rootStyles.selected,
      !attached && rootStyles.unattached,
      predicting && rootStyles.predicting,
    ],
    svg: [svgClassName],
    bg: [bgClassName, selected ? bgStyles.selected : bgStyles.notSelected],
    text: [textStyles],
  })
