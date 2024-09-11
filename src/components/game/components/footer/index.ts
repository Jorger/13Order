import "./styles.css";

const buttons = [
  ["lobby", "✕", "Go to the lobby"],
  ["solve", "❯", "Solve level"],
  ["restart", "↺", "Restart board"],
  ["pause", "||", "Puase"],
];

export default () => {
  return /*html*/ `<div class="game-fo jc"><button id="start" class="button">Start</button><div class="game-fo-o jc">${buttons
    .map(([id, icon, title]) => {
      return `<button class="game-fo-b" id="${id}" title="${title}">${icon}</button>`;
    })
    .join("")}</div></div>`;
};
