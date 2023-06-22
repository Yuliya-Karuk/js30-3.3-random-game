import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

/* SELECTORS */
const gameBoard = document.querySelector('.game-board') // <form> для поиска

// создали пустую доску ячейками
const grid = new Grid(4);
grid.createGrid(gameBoard)

// создали новую плитку и связали ее с рандомной пустой ячейкой
function createTile() {
    let tile = new Tile(gameBoard)
    let emptyCell = grid.getRandomEmptyCell()
    emptyCell.linkTile(tile)
}

createTile()
createTile()