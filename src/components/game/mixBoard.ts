type Position = number[];

let blnkx = 0;
let blnky = 0;

const fillTwo = (
  siz = 15,
  posit: Position = [],
  wid = 4,
  hgh = 4
): Position => {
  // Primero llenamos los dos últimos espacios.
  let s1 = -1;
  let s2 = -1;

  for (let i = 0; i <= siz; i++) {
    if (posit[i] === -1) {
      if (s1 < 0) {
        s1 = i;
        posit[s1] = siz - 1;
      } else {
        s2 = i;
        posit[s2] = siz - 2;
        break;
      }
    }
  }

  // Verificar la paridad de la permutación
  let c = 0;
  for (let i = 1; i <= siz; i++) {
    for (let j = 0; j < i; j++) {
      if (posit[j] > posit[i]) c++;
    }
  }

  c += wid - 1 - blnkx + (hgh - 1) - blnky;

  if (c & 1) {
    posit[s1] = siz - 2;
    posit[s2] = siz - 1;
  }

  return posit.filter((v) => v !== undefined);
};

const mixBoard = (
  siz = 15,
  hgh = 4,
  wid = 4,
  posit: Position = []
): Position => {
  let i = 0;
  let j = 0;
  let c = 0;

  const pcs = [];
  for (i = 0; i <= siz; i++) pcs[i] = i;
  pcs[siz - 1] = -1;
  pcs[siz - 2] = -1;

  for (i = 0; i < hgh; i++) {
    for (j = 0; j < wid; j++) {
      const k = Math.floor(Math.random() * pcs.length);
      posit[c] = pcs[k];

      if (pcs[k] === siz) {
        blnkx = j;
        blnky = i;
      }
      pcs[k] = pcs[pcs.length - 1];
      pcs.length--;
      c++;
    }
  }

  posit = fillTwo(siz, posit, wid, hgh);

  return posit;
};

export default mixBoard;
