import "./styles.css";
import {
  $,
  $$,
  addClass,
  addStyle,
  inlineStyles,
  removeClass,
  $on,
} from "../../utils/helpers";

export type Callback = (success?: boolean) => void;

export interface AlertShow {
  txt: string;
  icon: string;
  yes?: string;
  no?: string;
  cb?: Callback;
  timer?: number;
}

interface AlertProps {
  interval: NodeJS.Timeout | null;
  callback?: Callback;
  show({ txt, icon, yes, no, cb, timer }: AlertShow): void;
  hide(): void;
  render: () => string;
  events(): void;
}

const Alert: AlertProps = {
  interval: null,
  show({
    txt = "",
    icon = "",
    yes = "yes",
    no = "no",
    cb,
    timer = 0,
  }: AlertShow) {
    ($("modal .txt") as HTMLElement).innerHTML =
      (icon ? `<p ${inlineStyles({ "font-size": "3rem" })}>${icon}</p>` : "") +
      txt;
    addStyle($("modal #btn1"), { display: yes ? "block" : "none" });
    addStyle($("modal #btn2"), { display: no ? "block" : "none" });
    ($("modal #btn1") as HTMLElement).textContent = yes;
    ($("modal #btn2") as HTMLElement).textContent = no;
    removeClass($("modal") as HTMLElement, "hide");
    addClass($("modal") as HTMLElement, "show");

    if (this.interval) {
      clearTimeout(this.interval);
    }

    if (timer) {
      this.interval = setTimeout(() => {
        this.hide();
      }, timer);
    }

    if (cb) {
      this.callback = cb;
    }
  },
  hide() {
    removeClass($("modal") as HTMLEmbedElement, "show");
    addClass($("modal") as HTMLEmbedElement, "hide");

    if (this.interval) {
      clearTimeout(this.interval);
    }
  },
  render: () =>
    `<modal class="hide wh"><div class="ms wh"></div><div class="mw wh jc"><div class=mc><div class="wh jc txt"></div><div class="mb wh jc"><button id=btn1></button><button id=btn2></button></div></div></div></modal>`,
  events() {
    $$("modal button").forEach((btn) =>
      $on(btn as HTMLButtonElement, "click", (e) => {
        this.hide();
        this.callback && this.callback(e.target.id === "btn1");
      })
    );
  },
};

export default Alert;
