import MdUI from "@refina/mdui";
import { Plugin } from "refina";

const QuasiRuntime = new Plugin("quasi-runtime", (app) => {
  MdUI.install(app);
});
export default QuasiRuntime;
