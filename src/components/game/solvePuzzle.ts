let seq: number[] = []; // Secuencia de movimientos para resolver el puzzle
let blnkx = 0; // Posición x del espacio en blanco
let blnky = 0; // Posición y del espacio en blanco
let hgh = 0; // Altura del puzzle
let wid = 0; // Ancho del puzzle
let posit: number[] = []; // Posiciones actuales de las piezas del puzzle
let siz = 0; // Tamaño total del puzzle

/**
 * Función que realiza un movimiento en el puzzle
 * @param m
 */
const domove = (m = 0) => {
  /**
   * Cálculo del índice del espacio en blanco
   */
  const d = blnkx + blnky * wid;

  if (m === 0) {
    posit[d] = posit[d - 1];
    posit[d - 1] = siz;
    blnkx--;
  } else if (m === 1) {
    posit[d] = posit[d - wid];
    posit[d - wid] = siz;
    blnky--;
  } else if (m === 2) {
    posit[d] = posit[d + wid];
    posit[d + wid] = siz;
    blnky++;
  } else if (m === 3) {
    posit[d] = posit[d + 1];
    posit[d + 1] = siz;
    blnkx++;
  }
};

/**
 * Función que agrega una serie de movimientos a la secuencia de movimientos
 * @param positions
 */
const push = (positions: number[] = []) => {
  for (let i = 0; i < positions.length; i++) {
    const c = positions[i];
    if (seq.length && seq[seq.length - 1] + c === 3) seq.length--;
    else seq[seq.length] = c;
    domove(c);
  }
};

/**
 * Función que mueve una pieza a una posición específica en el puzzle
 */
const movepiece = (p = 0, y = 0, x = 0) => {
  let c = -1;
  let j = 0;
  let i = 0;

  for (i = 0; i < hgh; i++) {
    for (j = 0; j < wid; j++) {
      c++;
      if (posit[c] === p) break;
    }
    if (posit[c] === p) break;
  }

  /**
   * Mueve la pieza a la posición (x, y)...
   */
  if (j < x && blnky == y) push([2]);

  while (j > x) {
    if (blnky === i && blnkx > j) {
      if (i === hgh - 1) push([1]);
      else push([2]);
    }
    while (blnkx >= j) push([0]);
    while (blnkx < j - 1) push([3]);
    while (blnky < i) push([2]);
    while (blnky > i) push([1]);
    push([3]);
    j--;
  }
  while (j < x) {
    if (blnky === i && blnkx < j) {
      if (i === hgh - 1) push([1]);
      else push([2]);
    }
    while (blnkx <= j) push([3]);
    while (blnkx > j + 1) push([0]);
    while (blnky < i) push([2]);
    while (blnky > i) push([1]);
    push([0]);
    j++;
  }

  while (i > y) {
    if (y < i - 1) {
      while (blnky < i - 1) push([2]);
      if (blnkx === j) push([j == wid - 1 ? 0 : 3]);
      while (blnky > i - 1) push([1]);
      while (blnkx < j) push([3]);
      while (blnkx > j) push([0]);
      push([2]);
    } else {
      if (j !== wid - 1) {
        if (blnky === i) push([2]);
        while (blnkx < j + 1) push([3]);
        while (blnkx > j + 1) push([0]);
        while (blnky > i - 1) push([1]);
        while (blnky < i - 1) push([2]);
        push([0, 2]);
      } else {
        if (blnky < i && blnkx == j) {
          while (blnky < i) push([2]);
        } else {
          while (blnky > i + 1) push([1]);
          while (blnky < i + 1) push([2]);
          while (blnkx < j) push([3]);
          while (blnkx > j) push([0]);
          push([1, 1, 0, 2, 3, 2, 0, 1, 1, 3, 2]);
        }
      }
    }
    i--;
  }
  while (i < y) {
    if (blnkx === j && blnky < i) {
      if (j === wid - 1) push([0]);
      else push([3]);
    }
    while (blnky > i + 1) push([1]);
    while (blnky < i + 1) push([2]);
    while (blnkx < j) push([3]);
    while (blnkx > j) push([0]);
    push([1]);
    i++;
  }
};

/**
 * Función principal que devuelve la secuencia de pasos para resolver el puzzle...
 */
const getStepsSolvePuzzle = (
  totalSize = 15,
  posXEmpty = 0,
  posYEmpty = 0,
  Oposit: number[] = [],
  size = 0
) => {
  /**
   * Copia las posiciones iniciales
   */
  posit = JSON.parse(JSON.stringify(Oposit));

  blnkx = posXEmpty;
  blnky = posYEmpty;

  hgh = size;
  wid = size;

  siz = totalSize;

  seq.length = 0;

  const back = [];
  /**
   * Mueve las piezas en las filas del rompecabezas
   */
  for (let i = 0; i <= siz; i++) back[i] = posit[i];
  back[siz + 1] = blnkx;
  back[siz + 2] = blnky;

  let rr = 0;
  for (let r = 0; r < hgh - 2; r++) {
    for (let c = 0; c < wid; c++) movepiece(rr + c, r, c);
    rr += wid;
  }

  for (let c = 0; c < wid - 2; c++) {
    movepiece(rr, hgh - 2, c);
    if (blnkx === c) push([3]);
    if (posit[rr + wid] !== rr + wid) {
      movepiece(rr + wid, hgh - 1, c + 1);
      if (blnky !== hgh - 1) {
        if (blnkx === c + 1) push([3]);
        push([2]);
      }
      while (blnkx > c + 2) push([0]);
      push([0, 0, 1, 3, 2, 3, 1, 0, 0, 2, 3]);
    }
    rr++;
  }

  if (blnkx < wid - 1) push([3]);
  if (blnky < hgh - 1) push([2]);
  rr = siz - wid - 1;
  if (posit[rr] === rr + 1) push([1, 0, 2, 3]);
  if (posit[rr] === rr + wid) push([0, 1, 3, 2]);

  for (let i = 0; i <= siz; i++) posit[i] = back[i];
  blnkx = back[siz + 1];
  blnky = back[siz + 2];

  return seq;
};

export default getStepsSolvePuzzle;
