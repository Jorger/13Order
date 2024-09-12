import "./styles.css";
import { $, $on, setHtml } from "./utils/helpers";
import { PlaySound } from "./utils/sounds";
import { ROOT } from "./utils/constants";
import Container from "./components/container";
import onWindowResize from "./utils/resize-screen";
import Screen from "./Screen";

setHtml($(`#${ROOT}`), Container());

/**
 * Renderizar la pantalla, en este caso la de lobby...
 */
Screen();

$on(document as any, "contextmenu", (event) => event.preventDefault());

window.addEventListener("resize", onWindowResize);
onWindowResize();

const onClickEvent = (e: MouseEvent) => {
  const target = e.target as Element;
  const isTile = (target.id ?? "").includes("ti-");
  if (
    target &&
    !isTile &&
    ["a", "button"].includes(target.tagName.toLowerCase())
  ) {
    PlaySound("click");
  }
};

$on(window as any, "click", onClickEvent);
