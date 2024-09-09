import { TileProps } from "./components/tile";

const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const countInversions = (array: TileProps[]): number => {
  let inversions = 0;
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i].v > array[j].v) {
        inversions++;
      }
    }
  }
  return inversions;
};

const isSolvable = (matrix: TileProps[][]): boolean => {
  const flatArray = matrix.flat();
  const inversions = countInversions(flatArray);
  return inversions % 2 === 0;
};

export const shuffleMatrix = (matrix: TileProps[][]): TileProps[][] => {
  const rows = matrix.length;
  const cols = matrix[0].length;

  let shuffledMatrix: TileProps[][];

  do {
    // Aplanar la matriz en una sola lista
    const flatArray = matrix.flat();
    const shuffledArray = shuffleArray(flatArray);
    // Reconstruir la matriz desordenada
    shuffledMatrix = [];
    for (let i = 0; i < rows; i++) {
      shuffledMatrix[i] = shuffledArray.slice(i * cols, (i + 1) * cols);
    }
  } while (!isSolvable(shuffledMatrix));

  return shuffledMatrix;
};
