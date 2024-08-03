import Fuse from "fuse.js";

export const fuzzySearch = (array, word) => {
  const options = {
    keys: ["firstName", "lastName"],
  };

  const fuse = new Fuse(array, options);
  const result = fuse.search(word);
  return result;
};
