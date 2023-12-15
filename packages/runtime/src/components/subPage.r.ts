import { Content } from "refina";
import QuasiRuntime from "../plugin";
import { component, content, input, textProp } from "../types";
import { AppLayoutModel, currentNavSymbol } from "./appLayout.r";

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

QuasiRuntime.outputComponents.qSubPage = function (_) {
  return props => {
    const model = _.$runtimeData[currentNavSymbol] as AppLayoutModel;

    if (model.renderingState === "nav") {
      model.items.push([props.title, props.icon]);
    } else {
      if (model.current === props.title) {
        _.embed(props.inner);
      }
    }
  };
};

declare module "refina" {
  interface Components {
    qSubPage(props: SubPageProps): void;
  }
}
