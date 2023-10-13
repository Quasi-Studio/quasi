import { Context, view } from "refina";
import { SetBlockOnFocused } from "./mock.r";

let fn: (_: Context) => void = (_) => {}
SetBlockOnFocused((page: (_: Context) => void) => {
    fn = page
})

export default view((_) => {
    fn(_)
})