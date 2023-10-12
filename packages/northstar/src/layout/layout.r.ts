import { view } from "refina";
import styles from "./layout.style";

export default view((_) => {
  styles.root(_);
  _._div({}, (_) => {
    styles.toolbar(_);
    _._div({}, (_) => {
      _._p({}, "123");
    });

    styles.attribute(_);
    _._div({}, (_) => {});

    styles.visual_flow(_);
    _._div({}, (_) => {});

    styles.block(_);
    _._div({}, (_) => {});
  });
});
