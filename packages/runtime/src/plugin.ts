import MdUI2 from "@refina/mdui2";
import { Plugin } from "refina";

const QuasiRuntime = new Plugin("quasi-runtime", (app) => {
  MdUI2.install(app);
});
export default QuasiRuntime;
