/// <reference types="vite/client" />
import raw from "./dist/mdui2-dts.d.ts?raw";

const dts = raw
  .replace('/// <reference types="trusted-types" />', "")
  .replaceAll(/\bexport\b/g, "")
  .replace("export { }", "");

export default dts;
