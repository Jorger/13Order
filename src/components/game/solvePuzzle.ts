let seq: number[] = [];
let blnkx = 0;
let blnky = 0;
let hgh = 0;
let wid = 0;
let posit: number[] = [];
let siz = 0;

const domove = (m = 0) => {
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

const push = (positions: number[] = []) => {
  for (let i = 0; i < positions.length; i++) {
    const c = positions[i];
    if (seq.length && seq[seq.length - 1] + c === 3) seq.length--;
    else seq[seq.length] = c;
    domove(c);
  }
};

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

  //Move piece to same column         //0=right, 1=down, 2=up, 3=left
  if (j < x && blnky == y) push([2]); // move blank down if it might disturb solved pieces.
  while (j > x) {
    //move piece to left
    //First move blank to left hand side of it
    if (blnky === i && blnkx > j) {
      //if blank on wrong side of piece
      if (i === hgh - 1) push([1]);
      else push([2]); //then move it to other row
    }
    while (blnkx >= j) push([0]); // move blank to column left of piece
    while (blnkx < j - 1) push([3]);
    while (blnky < i) push([2]); // move blank to same row as piece
    while (blnky > i) push([1]);
    push([3]); // move piece to left.
    j--;
  }
  while (j < x) {
    //move piece to right
    //First move blank to right hand side of it
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

  //Move piece up to same row         //0=right, 1=down, 2=up, 3=left
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
    //move piece downwards
    //First move blank below tile
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

export const solve = (
  totalSize = 15,
  posXEmpty = 0,
  posYEmpty = 0,
  Oposit: number[] = [],
  size = 0
) => {
  posit = JSON.parse(JSON.stringify(Oposit));

  blnkx = posXEmpty;
  blnky = posYEmpty;

  hgh = size;
  wid = size;

  siz = totalSize;

  seq.length = 0;

  const back = [];
  for (let i = 0; i <= siz; i++) back[i] = posit[i];
  back[siz + 1] = blnkx;
  back[siz + 2] = blnky;

  //restore top rows
  let rr = 0;
  for (let r = 0; r < hgh - 2; r++) {
    for (let c = 0; c < wid; c++) movepiece(rr + c, r, c);
    rr += wid;
  }

  //restore left columns
  for (let c = 0; c < wid - 2; c++) {
    //restore top tile of column.
    movepiece(rr, hgh - 2, c);
    //restore bottom tile of column
    if (blnkx === c) push([3]); //fill destination spot
    if (posit[rr + wid] !== rr + wid) {
      movepiece(rr + wid, hgh - 1, c + 1);
      if (blnky !== hgh - 1) {
        //0=right, 1=down, 2=up, 3=left
        //A.X or AX.
        //XBX    XBX
        if (blnkx === c + 1) push([3]);
        push([2]);
      }
      //AXX
      //XB.
      while (blnkx > c + 2) push([0]);
      push([0, 0, 1, 3, 2, 3, 1, 0, 0, 2, 3]);
    }
    rr++;
  }
  //last 2x2 square
  if (blnkx < wid - 1) push([3]);
  if (blnky < hgh - 1) push([2]);
  rr = siz - wid - 1;
  if (posit[rr] === rr + 1) push([1, 0, 2, 3]);
  if (posit[rr] === rr + wid) push([0, 1, 3, 2]);

  //restore pieces;
  for (let i = 0; i <= siz; i++) posit[i] = back[i];
  blnkx = back[siz + 1];
  blnky = back[siz + 2];

  return seq;
};
