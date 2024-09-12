import { fillArray } from "./helpers";

export const MIN_STARS_NEXT_LEVEL = 10;
export const HEIGHT = 732;
export const WIDTH = 412;
export const SIZE_GRID = WIDTH - 30;
export const ROOT = "root";
export const CONTAINER = "container";
export const LEVEL_ENABLES_OTHER_LEVELS = 8;
export const TOTAL_LEVELS = 11;
export const NUMBER_HELP_PER_LEVEL = fillArray(TOTAL_LEVELS)
  .map((v, i) => ({
    [String(v + 3)]: 5 + i * 5,
  }))
  .reduce((a, s) => ({ ...a, ...s }), {});
