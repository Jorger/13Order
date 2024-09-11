import "./styles.css";
import { $, eventButton, setHtml } from "../../utils/helpers";
import { CONTAINER } from "../../utils/constants";
import renderLevels from "./helpers";
import Screen from "../../Screen";

export default () => {
  const render = /*html*/ `<div class="lobby wh jc"><div class="lobby-b jc">${renderLevels()}</div></div>`;

  setHtml($(`#${CONTAINER}`), render);

  eventButton((action) => {
    if (action.includes("level-")) {
      const size = +action.split("-")[1];
      Screen("Game", { s: size });
    }
  });
};
