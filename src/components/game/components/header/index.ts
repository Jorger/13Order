import "./styles.css";
import Sound from "../../../sound";

export default (size = 3) =>
  /*html*/ `<div class="game-he jc"><button id="lobby" title="Go to the lobby"><span>➜</span></button><div class="game-he-s">${size}x${size}</div><div class="game-he-t jc">⏰<span>00:00</span></div>${Sound()}</div>`;
