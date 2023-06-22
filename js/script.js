import { Grid } from "./grid.js";

/* SELECTORS */
const gameBoard = document.querySelector('.game-board') // <form> для поиска


const grid = new Grid(4);
grid.createGrid(gameBoard)