import { Content, D, view } from "refina";
import styles from "./layout.style";

export default (
    toolbar: D<Content> | undefined,
    block: D<Content> | undefined,
    visual_flow: D<Content> | undefined
  ) => view((_) => {
  styles.root(_);
  _._div({}, (_) => {
    styles.toolbar(_);
    _._div({}, toolbar);

    styles.block(_);
    _._div({}, block);

    styles.visual_flow(_);
    _._div({}, visual_flow);

  });
});
