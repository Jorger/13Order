import "./styles.css";
import { $, setHtml } from "../../utils/helpers";
import { CONTAINER } from "../../utils/constants";
import { Footer, Grid, Header } from "./components";
import { initComponent } from "./helpers";
import Alert from "../alert";

interface GameProps {
  s?: number;
}

const Game = ({ s = 3 }: GameProps) => {
  const render = /*html*/ `<div class="game wh jc si-${s}">${Header(
    s
  )}${Grid()}${Footer()}${Alert.render()}</div>`;

  setHtml($(`#${CONTAINER}`), render);

  initComponent(s);
};

export default Game;
