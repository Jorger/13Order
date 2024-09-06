import "./styles.css";

export interface TileProps {
  v: number;
  s: number;
  x: number;
  y: number;
  id: string;
}

export default ({ v = 0, s = 0, x = 0, y = 0, id }: TileProps) =>
  /*html*/ `<button id=${id} class="tile jc" style="width:${s}px;height:${s}px;left:${x}px;top:${y}px">${v}</button>`;
