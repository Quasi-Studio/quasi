/// <reference types="vite/client" />
import { ComponentContext, Content, OutputComponent } from "refina";
import QuasiRuntime from "../plugin";
import { Direction, component, content, textProp } from "../types";

export default component({
  displayName: () => "App layout",
  contents: {
    title: content("title", "as-primary"),
    topBar: content("top bar", "as-socket"),
    main: content("main", "as-socket", Direction.BOTTOM),
  },
  props: {
    class: textProp("class"),
  },
});

export interface AppLayoutProps {
  class: string;
  title: string;
  topBar: Content;
  main: Content;
}

@QuasiRuntime.outputComponent("qAppLayout")
export class QAppLayout extends OutputComponent {
  main(_: ComponentContext, props: AppLayoutProps): void {
    _.$cls(props.class);
    _.mdTopAppBar(_ => {
      _.mdTopAppBarTitle(
        _ =>
          _.$css`user-select:none;text-decoration:none;color:inherit` &&
          _._a({ href: window.__QUASI_PREVIEW__ ? "" : import.meta.env.BASE_URL }, props.title),
      );
      _.embed(props.topBar);
    });
    _.mdLayoutMain(props.main);
  }
}

declare module "refina" {
  interface OutputComponents {
    qAppLayout: QAppLayout;
  }
}
