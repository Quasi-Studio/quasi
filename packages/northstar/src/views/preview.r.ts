import { HTMLElementComponent, d, ref, view } from "refina";
/// <reference types="vite/client" />
//@ts-ignore
import refinaURL from "refina/src/index.ts?url";
//@ts-ignore
import basicComponentsURL from "@refina/basic-components/src/index.ts?url";
//@ts-ignore
import iframeURL from "./iframe.html?url";

import { RefinaTransformer } from "@refina/transformer";

const transformer = new RefinaTransformer();

const code = d(`
import { app } from "${refinaURL}";
import Basics from "${basicComponentsURL}";

let count = 0;

app.use(Basics)(${"_"} => {
  ${"_"}.p(\`You have clicked \$\{count\} \`)
  ${"_"}.button("Click me!") && count++;
});
`);

let codeModified = true;
let errorReported = false;
const iframe = ref<HTMLElementComponent<"iframe">>();
let errorMsg = "";

export default view(_ => {
  if (_.fTextarea(code, false, "", "both")) {
    codeModified = true;
    errorReported = false;
  }

  if (errorMsg.length > 0) {
    _.$cls`text-red-900 border border-red-500`;
    _._pre({}, errorMsg);
  }

  _.$noPreserve();
  _.$ref(iframe) &&
    _._iframe({
      // src: iframeURL,
      frameBorder: "0",
      width: "100%",
      height: "100%",
    });

  _.$app.pushHook("afterModifyDOM", () => {
    if (!_.$updating || !codeModified) return;
    codeModified = false;
    const iframeNode = iframe.current!.node;

    iframeNode.src = iframeURL;
    iframeNode.onload = () => {
      if (errorMsg !== "") {
        errorMsg = "";
        _.$update();
      }

      iframeNode.contentWindow!.onerror = (
        event: Event | string,
        source?: string,
        lineno?: number,
        colno?: number,
        error?: Error,
      ) => {
        if (errorReported) return;

        errorMsg = `ERROR: ${event}

source: ${source}
lineno: ${lineno}
colno: ${colno}
error: ${error}`;

        _.$update();
        errorReported = true;
      };
      //@ts-ignore
      iframeNode.contentWindow!.console.error = (...args: any[]) => {
        errorMsg += "\nCONSOLE ERROR: \n" + args.join(" ");
        _.$update();
      };

      const scriptNode = iframeNode.contentDocument!.getElementById("app-script")!;
      const transfomedCode = transformer.transform("0", code.value);

      scriptNode.innerHTML = transfomedCode;
    };
  });
});
