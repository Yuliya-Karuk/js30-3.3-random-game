import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

/* SELECTORS */
const gameBoard = document.querySelector('.game-board') // <form> для поиска

// создали пустую доску ячейками
const grid = new Grid(4);
grid.createGrid(gameBoard)

// функция создания новую плитки и связаваем ее с рандомной пустой ячейкой
function createTile() {
    let tile = new Tile(gameBoard)
    let emptyCell = grid.getRandomEmptyCell()
    emptyCell.linkTile(tile)
}

// функция, которая слушает нажатие клавишы 1 раз
function listenKeyboardOneClick() {
    window.addEventListener("keydown", handleInput, {once: true})
}

//функция, которая выполняет перемещение ячеек в зависимости от нажатой клавиши
function handleInput(evt) {
    switch (evt.key) {
        case "ArrowUp":
            moveUp()
            break;

        case "ArrowDown":
            moveDown();
            break;

        case "ArrowLeft":
            break;

        case "ArrowRight":
            break;
        default:
            listenKeyboardOneClick()
            return;
    }

    listenKeyboardOneClick()
}

// функция движения вверх
function moveUp() {
    slidesTiles(grid.cellsGroupedByColumn());
}

// функция движения вниз
function moveDown() {
    slidesTiles(grid.cellsGroupedByReversedColumn());
}

function slidesTiles(groupedCells) { // смещение плиток вверх по группу
    console.log(groupedCells)
    groupedCells.forEach(group => slideTilesInGroup(group));

    grid.cells.forEach(cell => {
        if (cell.hasTileForMerge()) {
            cell.mergeTiles();
        } 
    })
}

function slideTilesInGroup(group) { // смещение каждой плитки
    for(let i = 1; i < group.length; i++) {
        if (group[i].isEmpty()) {
            continue;
        }

        const cellWithTile = group[i];

        let targetCell;
        let j = i - 1;
        while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
            targetCell = group[j];
            j--;
        }

        if (!targetCell) {
            continue;
        }

        if (targetCell.isEmpty()) {
            targetCell.linkTile(cellWithTile.linkedTile);
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile)
        }

        cellWithTile.unlinkTile();
    }
}

createTile()
createTile()
listenKeyboardOneClick()