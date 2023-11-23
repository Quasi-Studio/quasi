import { OutputComponent, ComponentContext, Content } from "refina";
import QuasiRuntime from "../plugin";
import { component, content, Direction, textProp } from "..";

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

@QuasiRuntime.outputComponent("qCard")
export class QCard extends OutputComponent {
  main(_: ComponentContext, props: CardProps): void {
    _.$css`width:80%;left:10%;padding:18px;padding-top:0`;
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
  }
}

declare module "refina" {
  interface OutputComponents {
    qCard: QCard;
  }
}
