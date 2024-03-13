import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    ignores: ['packages/browser-tailwind/src/polyfill/*'],
  },
  {
    rules: {
      'ts/no-this-alias': ['off'],
      'style/arrow-parens': ['error', 'as-needed'],
    },
  },
)
