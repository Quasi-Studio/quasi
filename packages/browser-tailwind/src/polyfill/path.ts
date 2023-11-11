//@ts-nocheck
import { VIRTUAL_CONTENT_EXTNAME } from "./constants";

self.__dirname = "";
export default {
  join: () => {
    return "";
  },
  resolve: (id) => id,
  extname: (id) => self[VIRTUAL_CONTENT_EXTNAME],
};

export const join = () => {
  return "";
};
