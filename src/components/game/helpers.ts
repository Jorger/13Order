import {
  $,
  addStyle,
  eventButton,
  fillArray,
  generateUUID,
  setHtml,
} from "../../utils/helpers";
import { SIZE_GRID } from "../../utils/constants";
import { Tile } from "./components";
import { TileProps } from "./components/tile";

let SIZE_TILE = 0;
let GRID: TileProps[][] = [];
let SIZE_LEVEL = 0;

const calculatePosition = (c = 0, r = 0) => ({
  x: SIZE_TILE * c,
  y: SIZE_TILE * r,
});

const getTiles = (): TileProps[][] =>
  fillArray(SIZE_LEVEL).map((r) =>
    fillArray(SIZE_LEVEL).map((c) => {
      const value = c + 1 + r * SIZE_LEVEL;
      const number = value !== SIZE_LEVEL ** 2 ? value : 0;
      const { x, y } = calculatePosition(c, r);
      const id = `ti-${generateUUID()}`;

      return {
        v: number,
        s: SIZE_TILE,
        x,
        y,
        id,
      };
    })
  );

const createLevel = () => {
  SIZE_TILE = Math.round(SIZE_GRID / SIZE_LEVEL);
  GRID = getTiles();

  // console.log(GRID);

  const newTiles = GRID.map((f) => f.map((t) => (t.v !== 0 ? Tile(t) : "")))
    .flat()
    .join("");

  /*
  [CLOCKS.map((v) => Clock(v)), Bullet([...getBulletPosition(), BULLET_SIZE])]
      .flat()
      .join("")
  */

  setHtml($(".grid"), newTiles);
};

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

function shuffleMatrix(matrix: any[][]): any[][] {
  // Aplanar la matriz en una sola lista
  const flatArray = matrix.flat();

  // Desordenar la lista aplanada
  const shuffledArray = shuffleArray(flatArray);

  // Reconstruir la matriz desordenada
  const rows = matrix.length;
  const cols = matrix[0].length;
  const shuffledMatrix: any[][] = [];

  for (let i = 0; i < rows; i++) {
    shuffledMatrix[i] = shuffledArray.slice(i * cols, (i + 1) * cols);
  }

  return shuffledMatrix;
}

const getPositionZero = () => {
  for (let r = 0; r < SIZE_LEVEL; r++) {
    for (let c = 0; c < SIZE_LEVEL; c++) {
      if (GRID[r][c].v === 0) {
        return { r, c };
      }
    }
  }
};

const renderTiles = () => {
  for (let r = 0; r < SIZE_LEVEL; r++) {
    for (let c = 0; c < SIZE_LEVEL; c++) {
      addStyle($(`#${GRID[r][c].id}`) as HTMLElement, {
        left: `${GRID[r][c].x}px`,
        top: `${GRID[r][c].y}px`,
      });
    }
  }
};

const shuffleTiles = () => {
  GRID = shuffleMatrix(GRID);

  for (let r = 0; r < SIZE_LEVEL; r++) {
    for (let c = 0; c < SIZE_LEVEL; c++) {
      const { x, y } = calculatePosition(c, r);

      GRID[r][c].x = x;
      GRID[r][c].y = y;
    }
  }

  const lastValue = GRID[SIZE_LEVEL - 1][SIZE_LEVEL - 1].v;

  if (lastValue !== 0) {
    const positionZero = getPositionZero();
    const titleChangeCoordinate = { r: SIZE_LEVEL - 1, c: SIZE_LEVEL - 1 };
    const titleEmptyCoordinate = { r: positionZero!.r, c: positionZero!.c };
    const titleChange = GRID[titleChangeCoordinate.r][titleChangeCoordinate.c];
    const titleEmpty = GRID[titleEmptyCoordinate.r][titleEmptyCoordinate.c];

    const tileChangeID = titleChange.id;
    const tileChangeValue = titleChange.v;

    const tileEmptyID = titleEmpty.id;
    const tileEmptyValue = titleEmpty.v;

    GRID[titleEmptyCoordinate.r][titleEmptyCoordinate.c].id = tileChangeID;
    GRID[titleEmptyCoordinate.r][titleEmptyCoordinate.c].v = tileChangeValue;
    GRID[titleChangeCoordinate.r][titleChangeCoordinate.c].id = tileEmptyID;
    GRID[titleChangeCoordinate.r][titleChangeCoordinate.c].v = tileEmptyValue;
  }

  console.log(GRID);

  renderTiles();
};

/**
 * Función principal del componente...
 * @param level
 * @param isInfinity
 */
export const initComponent = (size = 3) => {
  SIZE_LEVEL = size;

  createLevel();

  eventButton((action) => {
    if (action === "start") {
      shuffleTiles();
    }
    console.log(action);
  });
};
