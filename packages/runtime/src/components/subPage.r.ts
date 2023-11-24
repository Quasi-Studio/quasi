import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "../plugin";
import { AppLayoutModel, currentNavSymbol } from "./appLayout.r";
import { component, content, input, textProp } from "../types";

export default component({
  displayName: () => "Sub page",
  contents: {
    inner: content("inner"),
  },
  inputs: {
    title: input("title", "as-primary"),
  },
  props: {
    icon: textProp("icon"),
  },
});

export interface SubPageProps {
  title: string;
  icon: string;
  inner: Content;
}

@QuasiRuntime.outputComponent("qSubPage")
export class QSubPage extends OutputComponent {
  main(_: ComponentContext, props: SubPageProps): void {
    const model = _.$runtimeData[currentNavSymbol] as AppLayoutModel;

    if (model.renderingState === "nav") {
      model.items.push([props.title, props.icon]);
    } else {
      if (model.current === props.title) {
        _.embed(props.inner);
      }
    }
  }
}

declare module "refina" {
  interface OutputComponents {
    qSubPage: QSubPage;
  }
}
