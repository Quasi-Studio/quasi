const LENGTH = 6
const HEIGHT = 10
const RADIUS = 5

export const PATH_OUT_TRIANGLE = `M 0 0 L 0 ${HEIGHT / 2} L ${LENGTH} 0 L 0 -${
  HEIGHT / 2
} Z`

export const PATH_IN_TRIANGLE = `M 0 0 L 0 ${HEIGHT / 2} L ${-LENGTH} 0 L 0 -${
  HEIGHT / 2
} Z`

export const PATH_OUT_RECT = `M 0 0 L 0 ${HEIGHT / 2} L ${LENGTH} ${
  HEIGHT / 2
} L ${LENGTH} ${-HEIGHT / 2} L 0 ${-HEIGHT / 2} Z`

export const PATH_IN_RECT = `M 0 0 L 0 ${HEIGHT / 2} L ${-LENGTH} ${
  HEIGHT / 2
} L ${-LENGTH} ${-HEIGHT / 2} L 0 ${-HEIGHT / 2} Z`

export const PATH_OUT_ELIPSE = `M 0 0 L 0 ${RADIUS} A ${RADIUS} ${RADIUS} 0 0 0 0 ${-RADIUS} Z`

export const PATH_IN_ELIPSE = `M 0 0 L 0 ${RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 0 ${-RADIUS} Z`
