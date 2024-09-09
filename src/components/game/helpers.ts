import { shuffleMatrix } from "./shuffleMatrix";
import { SIZE_GRID } from "../../utils/constants";
import { Tile } from "./components";
import { TileProps } from "./components/tile";
import {
  $,
  addClass,
  addStyle,
  delay,
  eventButton,
  fillArray,
  generateUUID,
  setHtml,
} from "../../utils/helpers";
import Alert from "../alert";

let SIZE_TILE = 0;
let GRID: TileProps[][] = [];
let SIZE_LEVEL = 0;
let GAME_STARTED = false;
let TIMER_ELEMET: HTMLElement;
let INTERVAL_CHRONOMETER: NodeJS.Timeout | null;
let TIMER = { m: 0, s: 0 };
let LEVEL_COMPLETED = false;

const DIRECTIONS_TO_MOVE = [
  {
    r: 0,
    c: -1,
  },
  {
    r: 1,
    c: 0,
  },
  {
    r: 0,
    c: 1,
  },
  {
    r: -1,
    c: 0,
  },
];

/**
 * Calcula la posició de la ficha en el escenario...
 * @param col
 * @param row
 * @returns
 */
const calculatePosition = (col = 0, row = 0) => ({
  x: SIZE_TILE * col,
  y: SIZE_TILE * row,
});

/**
 * Calcular la información de cada ficha en el escenario...
 * @returns
 */
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

/**
 * Crea la información base del nivel, dependiendo del tamaño del mismo...
 */
const createLevel = () => {
  SIZE_TILE = Math.round(SIZE_GRID / SIZE_LEVEL);
  GRID = getTiles();

  const newTiles = GRID.map((f) => f.map((t) => (t.v !== 0 ? Tile(t) : "")))
    .flat()
    .join("");

  setHtml($(".grid"), newTiles);
};

/**
 * Establece las posiciones de las fichas en el escenario...
 */
const renderTilesPosition = () => {
  for (let r = 0; r < SIZE_LEVEL; r++) {
    for (let c = 0; c < SIZE_LEVEL; c++) {
      addStyle($(`#${GRID[r][c].id}`) as HTMLElement, {
        left: `${GRID[r][c].x}px`,
        top: `${GRID[r][c].y}px`,
      });
    }
  }
};

/**
 * Cambia el valor de las fichas
 * @param origin
 * @param destinity
 */
const swapValues = (origin = { r: 0, c: 0 }, destinity = { r: 0, c: 0 }) => {
  const titleChange = GRID[origin.r][origin.c];
  const titleEmpty = GRID[destinity.r][destinity.c];

  const tileChangeID = titleChange.id;
  const tileChangeValue = titleChange.v;

  const tileEmptyID = titleEmpty.id;
  const tileEmptyValue = titleEmpty.v;

  GRID[destinity.r][destinity.c].id = tileChangeID;
  GRID[destinity.r][destinity.c].v = tileChangeValue;

  GRID[origin.r][origin.c].id = tileEmptyID;
  GRID[origin.r][origin.c].v = tileEmptyValue;
};

/**
 * Para establecer un orden aleatorio de las fichas...
 */
const shuffleTiles = () => {
  GRID = shuffleMatrix(GRID);

  for (let r = 0; r < SIZE_LEVEL; r++) {
    for (let c = 0; c < SIZE_LEVEL; c++) {
      const { x, y } = calculatePosition(c, r);

      GRID[r][c].x = x;
      GRID[r][c].y = y;
    }
  }

  renderTilesPosition();
};

/**
 * Dado el id de una ficha, devolver si filas y columna
 * @param id
 * @returns
 */
const getRowCol = (id = "") => {
  for (let r = 0; r < SIZE_LEVEL; r++) {
    for (let c = 0; c < SIZE_LEVEL; c++) {
      if (GRID[r][c].id === id) {
        return { r, c };
      }
    }
  }

  return { r: 0, c: 0 };
};

/**
 * Para saber si una posición dada está dentro del board...
 */
const rowColumnWithinBoard = (r = 0, c = 0) =>
  r >= 0 && r < SIZE_LEVEL && c >= 0 && c < SIZE_LEVEL;

/**
 * Valida si se puede mover una o varias fichas...
 * @param r
 * @param c
 * @returns
 */
const validateMoveTile = (r = 0, c = 0) => {
  let tilesToMove: { r: number; c: number }[] = [];
  let emptySpace = false;
  let direction = -1;

  for (let i = 0; i < DIRECTIONS_TO_MOVE.length; i++) {
    const { r: rI, c: cI } = DIRECTIONS_TO_MOVE[i];
    const posibleTiles: { r: number; c: number }[] = [];

    let newRow = r;
    let newCol = c;

    do {
      newRow += rI;
      newCol += cI;

      /**
       * Los valores están dentro del board...
       */
      if (rowColumnWithinBoard(newRow, newCol)) {
        const valueInCell = GRID[newRow][newCol].v;
        /**
         * Si es 0 quiere decir que es un espacio vacío...
         */
        if (valueInCell === 0) {
          emptySpace = true;
          break;
        } else {
          /**
           * Se guarda la ficha que se podría mover...
           */
          posibleTiles.push({ r: newRow, c: newCol });
        }
      } else {
        break;
      }
    } while (1);

    /**
     * Se encontró un espacio vacío por lo que se puede mover...
     */
    if (emptySpace) {
      direction = i;
      tilesToMove = posibleTiles;
      tilesToMove.unshift({ r, c });
      break;
    }
  }

  return { direction, tilesToMove };
};

/**
 * Valuda si las fichas ya se encuentran ordenadas...
 * @returns
 */
const validateOrderedTiles = () => {
  const flatArray = GRID.flat();
  const sizeTotal = SIZE_LEVEL ** 2;
  const lastTileValue = flatArray[sizeTotal - 1].v;
  let total = 0;

  for (let i = 0; i < flatArray.length; i++) {
    if (flatArray[i].v === i + 1) {
      total++;
    } else {
      break;
    }
  }

  const isOrdered = total + 1 === sizeTotal && lastTileValue === 0;

  return isOrdered;
};

/**
 * Validar cuando se hace click sobre una ficha...
 * @param id
 */
const clickOnTile = async (id = "") => {
  /**
   * Se obtiene la coordenada de la ficha dentro de la matriz....
   */
  const { r, c } = getRowCol(id);

  /**
   * Se valida si hay fichas que se puedan mover...
   */
  const { direction, tilesToMove } = validateMoveTile(r, c);

  /**
   * Si es mayor que 0 indica que hay fichas que se pueden mover...
   */
  if (direction >= 0) {
    /**
     * Se iteran las posibles fichas que se pueden mover, proceso que se hace
     * de atrás para adelante...
     */
    for (let i = tilesToMove.length - 1; i >= 0; i--) {
      const newRow = tilesToMove[i].r + DIRECTIONS_TO_MOVE[direction].r;
      const newCol = tilesToMove[i].c + DIRECTIONS_TO_MOVE[direction].c;

      /**
       * Se establece que se hace el cambio de valores...
       */
      swapValues(
        { r: tilesToMove[i].r, c: tilesToMove[i].c },
        { r: newRow, c: newCol }
      );
    }

    renderTilesPosition();

    /**
     * Se valida si las fichas ya están ordenadas...
     */
    if (validateOrderedTiles()) {
      stopChronometer();
      LEVEL_COMPLETED = true;
      await delay(500);

      Alert.show({
        icon: "🎉",
        txt: `<h4>Excellent, you solved the level in ${showIntervalValue()}, do you want to play again?</h4>`,
        no: "No",
        yes: "Yes",
        cb: (succes) => {
          if (succes) {
            startGame();
          } else {
            console.log("ir al lobby");
          }
        },
      });
    }
  }
};

const stopChronometer = () => {
  if (INTERVAL_CHRONOMETER) {
    clearInterval(INTERVAL_CHRONOMETER);
    INTERVAL_CHRONOMETER = null;
  }
};

const serializeIntervalNumber = (number = 0) =>
  number <= 9 ? `0${number}` : `${number}`;

const showIntervalValue = () =>
  `${serializeIntervalNumber(TIMER.m)}:${serializeIntervalNumber(TIMER.s)}`;

const startChronometer = () => {
  stopChronometer();

  TIMER_ELEMET!.textContent = showIntervalValue();

  INTERVAL_CHRONOMETER = setInterval(() => {
    TIMER.s++;

    if (TIMER.s === 60) {
      TIMER.s = 0;
      TIMER.m++;

      if (TIMER.m === 60) {
        stopChronometer();
      }
    }

    TIMER_ELEMET!.textContent = showIntervalValue();
  }, 1000);
};

/**
 * Para reiniciar el nivel...
 */
const startGame = () => {
  TIMER = { m: 0, s: 0 };
  shuffleTiles();
  stopChronometer();
  startChronometer();
};

/**
 * Función principal del componente...
 * @param level
 * @param isInfinity
 */
export const initComponent = (size = 3) => {
  SIZE_LEVEL = size;
  TIMER_ELEMET = $(".game-he-t span") as HTMLElement;

  createLevel();

  eventButton((action) => {
    if (action === "start") {
      GAME_STARTED = true;
      addClass($(".game-fo") as HTMLElement, "s");
      startGame();
    }

    if (action === "restart") {
      startGame();
    }

    if (action === "pause") {
      stopChronometer();
      Alert.show({
        icon: "⚠️",
        txt: `<h3>Do you want to continue solving the level or do you want to restart it?</h3>`,
        no: "Restart",
        yes: "Continue",
        cb: (succes) => {
          if (succes) {
            startChronometer();
          } else {
            startGame();
          }
        },
      });
    }

    if (action.includes("ti-") && GAME_STARTED && !LEVEL_COMPLETED) {
      clickOnTile(action);
    }

    if (action === "lobby") {
      console.log("IR AL LOBBY");
    }
  });

  Alert.events();
};
