import { fillArray, showIntervalValue } from "../../utils/helpers";
import { getValueFromCache } from "../../utils/storage";

export default () =>
  fillArray(11)
    .map((v) => {
      const size = v + 3;
      const time = getValueFromCache<{ m: number; s: number }>(`t-${size}`, {
        m: -1,
        s: -1,
      });

      let isDisabled = false;
      const hasTime = time.m >= 0 || time.s >= 0;

      // if (size >= 7) {
      //   isDisabled = !hasTime;
      // }

      /**
       * Renderiza el tiempo si ya se ha solucionado o un label, invitando
       * al jugador a jugar...
       */
      const renderTimerOrLabel = hasTime
        ? `<div class="lobby-t jc">⏰<span>${showIntervalValue(
            time
          )}</span></div>`
        : `<div class="lobby-m">Challenge now</div>`;

      return /*html*/ `<button id="level-${size}" class="button lobby-o jc" ${
        isDisabled ? "disabled" : ""
      }><span>${size} X ${size}</span>${renderTimerOrLabel}</button>`;
    })
    .join("");
