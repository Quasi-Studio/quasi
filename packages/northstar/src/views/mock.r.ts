import { Context, view } from "refina";
import {} from "@refina/fluentui"

let BlockOnFocused: (page: (_: Context) => void) => void

export default view((_) => {
    if (_.fButton("Send OnSelectMsg")) {
        BlockOnFocused((_: Context) => {
            _._p('123')
        })
    }
})

function SetBlockOnFocused(fn: (page: (_: Context) => void) => void): void {
    BlockOnFocused = fn
}

export {
    SetBlockOnFocused
}