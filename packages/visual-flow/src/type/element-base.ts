import { Guid } from "../util/guid";

type Patch = {
  [key: string]: any;
};

abstract class PluginConfig {
  update_batch(p: Patch): string[] {
    let ret = new Set<string>();
    for (let key in p) {
      let val = this.update(key, p[key]);
      for (let u of val) ret.add(u);
    }
    return [...ret];
  }

  abstract update(key: string, val: any): string[];
}

interface BaseConfig {
  plugins?: {
    [key: string]: PluginConfig;
  };
  fields: {
    [key: string]: any;
  };
  id: Guid;
}

abstract class ElementBase<T extends BaseConfig> {
  abstract el: HTMLElement | SVGElement;
  constructor(public val: T) {}

  abstract init(par_el: HTMLElement | SVGElement): void;

  update_batch(a: string[]): void {
    for (let i of a) this.update(i);
  }

  abstract update(key: string): void;

  patch(p: { [key: string]: any }) {
    let updateOption: string[] = [];
    for (let key in p) {
      if (this.val.fields.hasOwnProperty(key)) {
        this.val.fields[key] = p[key];
        updateOption.push(key);
      }
      if (this.val.plugins && this.val.plugins.hasOwnProperty(key)) {
        updateOption = [
          ...this.val.plugins[key].update_batch(p[key]),
          ...updateOption,
        ];
      }
    }
    this.update_batch(updateOption);
  }
}

export type { Patch, BaseConfig };

export { PluginConfig, ElementBase };
