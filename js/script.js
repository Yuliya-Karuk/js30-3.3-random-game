import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

/* SELECTORS */
const gameBoard = document.querySelector('.game-board') // блок с игрой
const popUpTop = document.querySelector('.popup-best') // попап с топ 10
const buttonTop = document.querySelector('.top-ten') // кнопка показать топ 10
const buttonNewGame = document.querySelector('.new-game') // кнопка запустить новую игру
const fieldScore = document.querySelector('.score') // поле, где выводятся очки за игру
const popUpGameOver= document.querySelector('.popup-gameover') // попап, если ты проиграл
const fieldGameoverScore= document.querySelector('.gameover-score') // очки за проигранную игру
const fieldBestScore= document.querySelector('.best-score') // очки за проигранную игру
const buttonGameover = document.querySelector('.gameover-button') //кнопка New game на попапе game over
let score = 0;
let bestScore = 0;

let grid;

//функция которая запускает новую игру 
function startNewGame() {
    popUpGameOver.classList.add('visually-hidden');
    gameBoard.innerHTML = '';
    score = 0;
    grid = new Grid(4);
    grid.createGrid(gameBoard)
    createTile()
    createTile()
    listenKeyboardOneClick()
    buttonNewGame.blur()
}

function endGame() {
    popUpGameOver.classList.remove('visually-hidden');
    fieldGameoverScore.innerHTML = `${score}`;
    fieldBestScore.innerHTML = `${bestScore}`
}

document.addEventListener("DOMContentLoaded", startNewGame); 
buttonNewGame.addEventListener("click", startNewGame)
buttonGameover.addEventListener("click", startNewGame)

// функция создания новую плитки и связаваем ее с рандомной пустой ячейкой
function createTile() {
    let tile = new Tile(gameBoard)
    let emptyCell = grid.getRandomEmptyCell()
    emptyCell.linkTile(tile)
    return tile
}

// функция, которая слушает нажатие клавишы 1 раз
function listenKeyboardOneClick() {
    window.addEventListener("keydown", handleInput, {once: true})
}

//функция, которая выполняет перемещение ячеек в зависимости от нажатой клавиши
async function handleInput(evt) {
    switch (evt.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                listenKeyboardOneClick()
                return;
            }
            
            await moveUp()
            break;

        case "ArrowDown":
            if (!canMoveDown()) {
                listenKeyboardOneClick()
                return;
            }

            await moveDown();
            break;

        case "ArrowLeft":
            if (!canMoveLeft()) {
                listenKeyboardOneClick()
                return;
            }

            await moveLeft();
            break;

        case "ArrowRight":
            if (!canMoveRight()) {
                listenKeyboardOneClick()
                return;
            }

            await moveRight();
            break;
        default:
            listenKeyboardOneClick()
            return;
    }

    const newTile = createTile()

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd();
        endGame()
        return;
    }

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
            score = score + cell.mergeTiles();
            fieldScore.innerHTML = `${score}`
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

// функции, которые проверяют при клике на стрелку будет ли двигаться хоть 1 ячейка.
// Чтобы при клике на стрелку, если ничего не двигается, не возникала новая плитка
function canMoveUp() {
    return canMove(grid.cellsGroupedByColumn())
}

function canMoveDown() {
    return canMove(grid.cellsGroupedByReversedColumn())
}

function canMoveLeft() {
    return canMove(grid.cellsGroupedByRow())
}

function canMoveRight() {
    return canMove(grid.cellsGroupedByReversedRow())
}

function canMove(groupedCells) {
    return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
    return group.some((cell, index) => {
        if (index === 0) {
            return false
        }

        if (cell.isEmpty()) {
            return false
        }

        const targetCell = group[index - 1]
        return targetCell.canAccept(cell.linkedTile);
    });
}