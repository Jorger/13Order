import "./styles.css";
import { CONTAINER } from "../../utils/constants";
import { getValueFromCache } from "../../utils/storage";
import {
  setHtml,
  $,
  fillArray,
  showIntervalValue,
  eventButton,
} from "../../utils/helpers";
import Screen from "../../Screen";

export default () => {
  const levels = fillArray(8)
    .map((v) => {
      const size = v + 3;
      const time: { m: number; s: number } = getValueFromCache(`t-${size}`, {
        m: -1,
        s: -1,
      });

      let isDisabled = false;
      const hasTime = time.m >= 0 || time.s >= 0;

      if (size >= 7) {
        isDisabled = !hasTime;
      }

      return /*html*/ `<button id="level-${size}" class="button lobby-o jc" ${
        isDisabled ? "disabled" : ""
      }>
      <span>${size} X ${size}</span>${
        hasTime
          ? `<div class="lobby-t jc">⏰<span>${showIntervalValue(
              time
            )}</span></div>`
          : `<div class="lobby-m">Challenge now</div>`
      }</button>`;
    })
    .join("");

  const render = /*html*/ `<div class="lobby wh jc"><div class="lobby-b jc">${levels}</div></div>`;

  setHtml($(`#${CONTAINER}`), render);

  eventButton((action) => {
    if (action.includes("level-")) {
      const size = +action.split("-")[1];
      Screen("Game", { s: size });
    }
  });
};
