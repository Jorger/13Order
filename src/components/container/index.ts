import "./styles.css";
import { CONTAINER, HEIGHT, WIDTH } from "../../utils/constants";

export default () =>
  /*html*/ `<div id="${CONTAINER}" style="overflow: hidden;width:${WIDTH}px;height:${HEIGHT}px"></div>`;
