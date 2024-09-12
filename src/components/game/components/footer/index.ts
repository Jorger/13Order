import "./styles.css";

const buttons = [
  ["help", "💡", "Help"],
  ["solve", "❯", "Solve level"],
  ["restart", "↺", "Restart board"],
];

export default () => {
  return /*html*/ `<div class="game-fo jc"><button id="start" class="button">Start</button><div class="game-fo-o jc">${buttons
    .map(([id, icon, title]) => {
      return `<button class="game-fo-b" id="${id}" title="${title}">
      ${icon}${id === "help" ? `<span class="jc"></span>` : ""}
      </button>`;
    })
    .join("")}</div></div>`;
};
