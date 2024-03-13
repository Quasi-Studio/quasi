import { Component, Content, _ } from "refina";

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

export class QSubPage extends Component {
  $main(props: SubPageProps) {
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
