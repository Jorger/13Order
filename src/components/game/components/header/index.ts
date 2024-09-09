import "./styles.css";

export default (size = 3) =>
  /*html*/ `<div class="game-he jc"><div class="game-he-s">${size}x${size}</div><div class="game-he-t jc">⏰<span>00:00</span></div></div>`;
