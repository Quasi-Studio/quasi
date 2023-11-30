/// <reference types="vite/client" />
import {
  Content,
  Context,
  HTMLElementComponent,
  OutputComponent,
  ref,
} from "refina";
import QuasiRuntime from "../plugin";
import { Direction, component, content, textProp } from "../types";

export default component({
  displayName: () => "App layout",
  model: "AppLayoutModel",
  contents: {
    title: content("title", "as-primary"),
    topBar: content("top bar", "as-socket"),
    content: content("content", "as-socket", Direction.BOTTOM),
  },
  props: {
    class: textProp("class"),
  },
});

export const currentNavSymbol = Symbol("currentNav");

export interface AppLayoutProps {
  class: string;
  title: string;
  topBar: Content;
  content: Content;
}

export class AppLayoutModel {
  renderingState: "nav" | "main";
  items: [value: string, iconName?: string][];
  current: string;
}

@QuasiRuntime.outputComponent("qAppLayout")
export class QAppLayout extends OutputComponent {
  navRailRef = ref<HTMLElementComponent<"mdui-navigation-rail">>();
  main(_: Context, model: AppLayoutModel, props: AppLayoutProps): void {
    _.$cls(props.class);
    _.$css`position:fixed;width:100%;height:100%`;
    _.mdLayout(_ => {
      _.mdTopAppBar(_ => {
        _.mdTopAppBarTitle(
          _ =>
            _.$css`user-select:none;text-decoration:none;color:inherit` &&
            _._a(
              {
                href: window.__QUASI_PREVIEW__ ? "" : import.meta.env.BASE_URL,
              },
              props.title,
            ),
        );
        _.embed(props.topBar);
      });

      _.provide(currentNavSymbol, model, _ => {
        model.renderingState = "nav";
        model.items = [];
        _.embed(props.content);
      });

      _.$css`height:100%`;
      model.current = _.mdNavRail(model.items);

      _.mdLayoutMain(_ => {
        _.$css`padding:18px;padding-right:64px`;
        _._div({}, _ =>
          _.provide(currentNavSymbol, model, _ => {
            model.renderingState = "main";
            _.embed(props.content);
          }),
        );
      });
    });
  }
}

declare module "refina" {
  interface OutputComponents {
    qAppLayout: QAppLayout;
  }
}
