import { getValueFromCache, savePropierties } from "../../utils/storage";
import { NUMBER_HELP_PER_LEVEL, SIZE_GRID } from "../../utils/constants";
import { PlaySound, toogleSounds } from "../../utils/sounds";
import { Tile } from "./components";
import { TileProps } from "./components/tile";
import {
  $,
  $$,
  addClass,
  addStyle,
  delay,
  eventButton,
  fillArray,
  generateUUID,
  setHtml,
  showIntervalValue,
  timeToseconds,
} from "../../utils/helpers";
import Alert from "../alert";
import getStepsSolvePuzzle from "./solvePuzzle";
import mixBoard from "./mixBoard";
import Screen from "../../Screen";

let SIZE_TILE = 0;
let GRID: TileProps[][] = [];
let SIZE_LEVEL = 0;
let GAME_STARTED = false;
let TIMER_ELEMET: HTMLElement;
let TOTAL_HELP_ELEMENT: HTMLElement;
let INTERVAL_CHRONOMETER: NodeJS.Timeout | null;
let TIMER = { m: 0, s: 0 };
let LEVEL_COMPLETED = false;
let INTERVAL_SOLVE: NodeJS.Timeout;
let IS_SOLVING = false;
let TOTAL_HELP = 0;
let STEPS_SOLVE_PUZZLE: number[] = [];
let COUNTER_SOLVE = 0;
let CLICK_TILE = false;

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
  // SIZE_TILE = Math.round(SIZE_GRID / SIZE_LEVEL);
  SIZE_TILE = SIZE_GRID / SIZE_LEVEL;
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

  PlaySound("shot");
};

/**
 * Para establecer un orden aleatorio de las fichas...
 */
const shuffleTiles = () => {
  const size = SIZE_LEVEL ** 2;
  const posit = fillArray(size);
  const orgData = mixBoard(size - 1, size, size, posit);
  const base = orgData.map((v) => (v + 1 === size ? 0 : v + 1));
  const shuffle = base.map((v) => [v, getCellIDByValue(v).id]);
  const tmpMatriz = [];

  for (let i = 0; i < size; i += SIZE_LEVEL) {
    tmpMatriz.push(shuffle.slice(i, i + SIZE_LEVEL));
  }

  for (let r = 0; r < SIZE_LEVEL; r++) {
    for (let c = 0; c < SIZE_LEVEL; c++) {
      const [value, id] = tmpMatriz[r][c];
      const { x, y } = calculatePosition(c, r);
      GRID[r][c].v = value as number;
      GRID[r][c].id = id as string;

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

const getCellIDByValue = (value = 0) => {
  for (let r = 0; r < SIZE_LEVEL; r++) {
    for (let c = 0; c < SIZE_LEVEL; c++) {
      if (GRID[r][c].v === value) {
        return { r, c, id: GRID[r][c].id };
      }
    }
  }

  return { r: 0, c: 0, id: "" };
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
 * Guarda el tiempo que tomó en resolver el nivel,
 * sólo guarda cuando el tiempo es inferior al que se tenía antes
 */
const saveTimeSolveLevel = () => {
  const cacheKey = `t-${SIZE_LEVEL}`;
  const currentTime = getValueFromCache<{ m: number; s: number }>(cacheKey, {
    m: -1,
    s: -1,
  });

  const hasTime = currentTime.m >= 0 || currentTime.s >= 0;
  let saveTime = true;

  if (hasTime) {
    // Para validar si el nuevo tiempo es menor que el tiempo que estaba...
    saveTime = timeToseconds(TIMER) < timeToseconds(currentTime);
  }

  if (saveTime) {
    // Se guarda el tiempo que tomó resolver el nivel...
    savePropierties<{ m: number; s: number }>(`t-${SIZE_LEVEL}`, TIMER);
  }
};

const showMessage = async () => {
  LEVEL_COMPLETED = true;
  await delay(500);

  const data = {
    icon: "🎉",
    txt: `<h4>Excellent, you solved the level in ${showIntervalValue(
      TIMER
    )}, do you want to play again?</h4>`,
  };

  if (IS_SOLVING) {
    data.icon = "🤖";
    data.txt =
      "<h4>I've solved the level for you!, This doesn't count as if you had solved it yourself 😉. Want to give it another shot? 🎉</h4>";
  }

  Alert.show({
    ...data,
    no: "No",
    yes: "Yes",
    cb: (succes) => {
      if (succes) {
        startGame();
      } else {
        Screen();
      }
    },
  });

  PlaySound("gameOver");
};

const showErroMessage = () => {
  Alert.show({
    icon: "😭",
    txt: "<h4>Sorry, I haven't found a solution for this level, do you want to try again?</h4>",
    no: "No",
    yes: "Yes",
    cb: (succes) => {
      if (succes) {
        startGame();
      } else {
        Screen();
      }
    },
  });

  PlaySound("blocked");
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
      saveTimeSolveLevel();
      stopChronometer();
      showMessage();
    }

    CLICK_TILE = true;
  }
};

const stopChronometer = () => {
  if (INTERVAL_CHRONOMETER) {
    clearInterval(INTERVAL_CHRONOMETER);
    INTERVAL_CHRONOMETER = null;
  }
};

const startChronometer = () => {
  stopChronometer();

  TIMER_ELEMET!.textContent = showIntervalValue(TIMER);

  INTERVAL_CHRONOMETER = setInterval(() => {
    TIMER.s++;

    if (TIMER.s === 60) {
      TIMER.s = 0;
      TIMER.m++;

      if (TIMER.m === 60) {
        stopChronometer();
      }
    }

    TIMER_ELEMET!.textContent = showIntervalValue(TIMER);
  }, 1000);
};

const showTotalHelp = () => {
  TOTAL_HELP_ELEMENT.textContent = `${TOTAL_HELP}`;
};

/**
 * Para reiniciar el nivel...
 */
const startGame = () => {
  TOTAL_HELP = NUMBER_HELP_PER_LEVEL[SIZE_LEVEL];
  IS_SOLVING = false;
  LEVEL_COMPLETED = false;
  CLICK_TILE = false;
  COUNTER_SOLVE = 0;
  TIMER = { m: 0, s: 0 };
  STEPS_SOLVE_PUZZLE = [];
  showTotalHelp();

  changeStateButtons(false);
  shuffleTiles();
  stopChronometer();
  startChronometer();
};

const automaticMovementSolvePuzzle = (counter = 0, order: number[] = []) => {
  const movement = order[counter];
  const tmpDirection = ["right", "down", "up", "left"];
  const { r: xEmpty, c: yEmpty } = getCellIDByValue(0);

  const directions = [
    {
      r: 0,
      c: -1,
    },
    {
      r: -1,
      c: 0,
    },
    {
      r: 1,
      c: 0,
    },
    {
      r: 0,
      c: 1,
    },
  ];

  const newRow = xEmpty + directions[movement].r;
  const newCol = yEmpty + directions[movement].c;

  if (rowColumnWithinBoard(newRow, newCol)) {
    swapValues({ r: newRow, c: newCol }, { r: xEmpty, c: yEmpty });
    renderTilesPosition();
  } else {
    ($("#help") as HTMLButtonElement).disabled = true;
    clearInterval(INTERVAL_SOLVE);
    stopChronometer();
  }
};

const changeStateButtons = (isDisabled = false) => {
  $$(".game-fo-o > button").forEach((button) => {
    // @ts-ignore
    button.disabled = isDisabled;
  });
};

const getSolvePuzzleValues = () => {
  const { r: x, c: y } = getCellIDByValue(0);
  const size = SIZE_LEVEL ** 2;
  const posit = GRID.flat().map((v) => (v.v === 0 ? size - 1 : v.v - 1));
  const solveValue = getStepsSolvePuzzle(size - 1, y, x, posit, SIZE_LEVEL);

  return solveValue;
};

const solvePuzzle = () => {
  IS_SOLVING = true;

  // Bloquer los botones...
  changeStateButtons(true);

  STEPS_SOLVE_PUZZLE = getSolvePuzzleValues();

  let counter = 0;
  INTERVAL_SOLVE = setInterval(() => {
    if (counter < STEPS_SOLVE_PUZZLE.length) {
      automaticMovementSolvePuzzle(counter, STEPS_SOLVE_PUZZLE);
      counter++;
    } else {
      clearInterval(INTERVAL_SOLVE);
      const levelSolved = validateOrderedTiles();

      if (levelSolved) {
        showMessage();
      } else {
        showErroMessage();
      }
    }
  }, 100);
};

/**
 * Función principal del componente...
 * @param level
 * @param isInfinity
 */
export const initComponent = (size = 3) => {
  SIZE_LEVEL = size;
  TIMER_ELEMET = $(".game-he-t span") as HTMLElement;
  TOTAL_HELP_ELEMENT = $("#help span") as HTMLElement;
  GAME_STARTED = false;

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

    if (action === "help") {
      if (TOTAL_HELP - 1 >= 0) {
        TOTAL_HELP--;
        showTotalHelp();

        if (STEPS_SOLVE_PUZZLE.length === 0 || CLICK_TILE) {
          COUNTER_SOLVE = 0;
          STEPS_SOLVE_PUZZLE = getSolvePuzzleValues();
          CLICK_TILE = false;
        } else {
          COUNTER_SOLVE++;
        }

        if (STEPS_SOLVE_PUZZLE.length > 0) {
          let levelSolved = false;

          if (COUNTER_SOLVE < STEPS_SOLVE_PUZZLE.length) {
            automaticMovementSolvePuzzle(COUNTER_SOLVE, STEPS_SOLVE_PUZZLE);
            levelSolved = validateOrderedTiles();
          }

          if (levelSolved) {
            showMessage();
          }
        } else {
          showErroMessage();
        }
      }
    }

    if (
      action.includes("ti-") &&
      GAME_STARTED &&
      !LEVEL_COMPLETED &&
      !IS_SOLVING
    ) {
      clickOnTile(action);
    }

    if (action === "solve") {
      stopChronometer();
      solvePuzzle();
    }

    if (action === "lobby") {
      clearInterval(INTERVAL_SOLVE);
      stopChronometer();
      Screen();
    }

    if (action === "sounds") {
      toogleSounds($("#sounds") as HTMLElement);
    }
  });

  Alert.events();
};
