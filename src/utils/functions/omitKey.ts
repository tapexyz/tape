// @ts-ignore
import omitDeep from "omit-deep";

const omitKey = (object: any, name: string) => {
  return omitDeep(object, name);
};

export default omitKey;
