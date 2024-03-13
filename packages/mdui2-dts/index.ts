/// <reference types="vite/client" />
// eslint-disable-next-line antfu/no-import-dist
import raw from './dist/mdui2-dts.d.ts?raw'

const dts = raw
  .replace('/// <reference types="trusted-types" />', '')
  .replaceAll(/\bexport\b/g, '')
  .replace('export { }', '')

export default dts
