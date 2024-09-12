import "./styles.css";
import { isSoundsEnabled } from "../../utils/sounds";

export default () =>
  /*html*/ `<button id="sounds" class="jc" title="Sounds">${
    isSoundsEnabled() ? "🔈" : "🔇"
  } </button>`;
