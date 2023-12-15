import { Content } from "refina";
import QuasiRuntime from "../plugin";
import { Direction, component, content, textProp } from "../types";

export default component({
  displayName: () => "Card",
  contents: {
    title: content("title", "as-primary"),
    inner: content("inner", "as-socket", Direction.BOTTOM),
  },
  props: {
    class: textProp("class"),
  },
});

export interface CardProps {
  title: Content;
  inner: Content;
  class: string;
}

QuasiRuntime.outputComponents.qCard = function (_) {
  return props => {
    _.$css`width:100%;padding:18px;padding-top:0`;
    _.$cls(props.class);
    _._mdui_card(
      {
        variant: "filled",
      },
      _ => {
        _._h2({}, props.title);
        _.embed(props.inner);
      },
    );
  };
};

declare module "refina" {
  interface Components {
    qCard(props: CardProps): void;
  }
}
