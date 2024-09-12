import { fillArray, showIntervalValue } from "../../utils/helpers";
import { getValueFromCache } from "../../utils/storage";
import {
  LEVEL_ENABLES_OTHER_LEVELS,
  TOTAL_LEVELS,
} from "../../utils/constants";

export default () => {
  const timeNextLevels = getValueFromCache<{ m: number; s: number }>(
    `t-${LEVEL_ENABLES_OTHER_LEVELS}`,
    {
      m: -1,
      s: -1,
    }
  );

  const enabledOtherLevels = timeNextLevels.m >= 0 || timeNextLevels.s >= 0;

  return fillArray(TOTAL_LEVELS)
    .map((v) => {
      const size = v + 3;
      const time = getValueFromCache<{ m: number; s: number }>(`t-${size}`, {
        m: -1,
        s: -1,
      });

      const isDisabled =
        size <= LEVEL_ENABLES_OTHER_LEVELS ? false : !enabledOtherLevels;
      const hasTime = time.m >= 0 || time.s >= 0;

      /**
       * Renderiza el tiempo si ya se ha solucionado o un label, invitando
       * al jugador a jugar...
       */
      const renderTimerOrLabel = hasTime
        ? `<div class="lobby-t jc">⏰<span>${showIntervalValue(
            time
          )}</span></div>`
        : `<div class="lobby-m">Challenge now ${
            isDisabled ? "<span>🔐</span>" : ""
          }</div>`;

      return /*html*/ `<button id="level-${size}" class="button lobby-o jc" ${
        isDisabled ? "disabled" : ""
      }><span>${size} X ${size}</span>${renderTimerOrLabel}</button>`;
    })
    .join("");
};
