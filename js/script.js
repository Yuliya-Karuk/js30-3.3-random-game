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

createTile() // cоздали 2 ячейки и запустили листенер движения
createTile()
listenKeyboardOneClick()

//функция, которая выполняет перемещение ячеек в зависимости от нажатой клавиши
async function handleInput(evt) {
    switch (evt.key) {
        case "ArrowUp":
            await moveUp()
            break;

        case "ArrowDown":
            await moveDown();
            break;

        case "ArrowLeft":
            await moveLeft();
            break;

        case "ArrowRight":
            await moveRight();
            break;
        default:
            listenKeyboardOneClick()
            return;
    }

    createTile()
    listenKeyboardOneClick()
}

// функция движения вверх
async function moveUp() {
    await slidesTiles(grid.cellsGroupedByColumn());
}

// функция движения вниз
async function moveDown() {
    await slidesTiles(grid.cellsGroupedByReversedColumn());
}

// функция движения влево
async function moveLeft() {
    await slidesTiles(grid.cellsGroupedByRow());
}

// функция движения вправо
async function moveRight() {
    await slidesTiles(grid.cellsGroupedByReversedRow());
}

async function slidesTiles(groupedCells) { // смещение плиток вверх по группу
    const promises = [];
    console.log(groupedCells)
    groupedCells.forEach(group => slideTilesInGroup(group, promises));

    await Promise.all(promises);

    grid.cells.forEach(cell => {
        if (cell.hasTileForMerge()) {
            cell.mergeTiles();
        } 
    })
}

function slideTilesInGroup(group, promises) { // смещение каждой плитки
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

        promises.push(cellWithTile.linkedTile.waitForTransitionEnd())

        if (targetCell.isEmpty()) {
            targetCell.linkTile(cellWithTile.linkedTile);
        } else {
            targetCell.linkTileForMerge(cellWithTile.linkedTile)
        }

        cellWithTile.unlinkTile();
    }
}