import "./styles.css";
import { CONTAINER, HEIGHT, WIDTH } from "../../utils/constants";

const Container = () => {
  return /*html*/ `<div id="${CONTAINER}" style="overflow: hidden;width:${WIDTH}px;height:${HEIGHT}px"></div>`;
};

export default Container;
