import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

/* SELECTORS */
const gameBoard = document.querySelector('.game-board') // <form> для поиска

// создали пустую доску ячейками
const grid = new Grid(4);
grid.createGrid(gameBoard)

// созадли новую плитку и связали ее с рандомной пустой ячейкой
const tile = new Tile(gameBoard)
const emptyCell = grid.getRandomEmptyCell()
emptyCell.linkTile(tile)

// grid.getRandomEmptyCell().linkTile( new Tile(gameBoard))