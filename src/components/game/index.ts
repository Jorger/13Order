import "./styles.css";
import { $, setHtml } from "../../utils/helpers";
import { CONTAINER } from "../../utils/constants";
import { Grid } from "./components";
import { initComponent } from "./helpers";

interface GameProps {
  s?: number;
}

const Game = ({ s = 3 }: GameProps) => {
  const render = /*html*/ `<div class="game wh jc si-${s}">${Grid()}<button id="start">Start</button></div>`;

  setHtml($(`#${CONTAINER}`), render);

  initComponent(s);
};

export default Game;
