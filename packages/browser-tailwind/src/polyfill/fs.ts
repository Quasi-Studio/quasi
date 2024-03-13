// @ts-nocheck
import { VIRTUAL_SOURCE_PATH } from './constants'

let i = 0
self.BUILD_ID = 0

export default {
  statSync: id => {
    if (id === VIRTUAL_SOURCE_PATH)
      return { mtimeMs: self.BUILD_ID }

    return { mtimeMs: ++i }
  },
  readFileSync: id => self[id] ?? '',
  promises: {
    readFile(id) {
      return self[id] ?? ''
    },
  },
}
