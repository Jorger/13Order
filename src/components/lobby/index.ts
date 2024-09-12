import "./styles.css";
import { $, eventButton, setHtml } from "../../utils/helpers";
import { CONTAINER } from "../../utils/constants";
import Nav from "./components/nav";
import renderLevels from "./helpers";
import Screen from "../../Screen";
import { toogleSounds } from "../../utils/sounds";

export default () => {
  const render = /*html*/ `<div class="lobby wh jc">${Nav()}<div class="lobby-b jc">${renderLevels()}</div><a href="https://js13kgames.com/" target="_blank" class="lobby-l">Js13k 2024</a></div>`;

  setHtml($(`#${CONTAINER}`), render);

  eventButton((action) => {
    if (action.includes("level-")) {
      const size = +action.split("-")[1];
      Screen("Game", { s: size });
    }

    if (action === "sounds") {
      toogleSounds($("#sounds") as HTMLElement);
    }
  });
};
