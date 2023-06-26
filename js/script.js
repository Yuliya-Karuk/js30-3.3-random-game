import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

/* SELECTORS */
const gameBoard = document.querySelector('.game-board'); // блочный элемент div с игрой

const buttonTop = document.querySelector('.top-ten') // кнопка показать топ 10
const buttonNewGame = document.querySelector('.new-game') // кнопка запустить новую игру
const fieldScore = document.querySelector('.score') // поле, где выводятся очки за текущую игру
const fieldBestScore = document.querySelector('.best') // поле, где выводятся лучший результат за полседние 10 игр

const popUpGameOver= document.querySelector('.popup-gameover') // попап, если ты проиграл
const fieldGameoverScore= document.querySelector('.gameover-score') // очки за проигранную игру
const fieldGameoverBestScore= document.querySelector('.best-score') // лучший результат
const buttonGameoverNewGame = document.querySelector('.gameover-button') //кнопка New game на попапе game over

const popUpWin = document.querySelector('.popup-win') // попап, если ты выиграл
const fieldWinScore = document.querySelector('.win-score') // очки за выигранную игру
const fieldWinBestScore = document.querySelector('.win-best-score') // лучший результат
const buttonWinNewGame = document.querySelector('.win-gameover-button') //кнопка New game на попапе win
const buttonWinContinue = document.querySelector('.win-continue-button') //кнопка New game на попапе win

const popUpTop = document.querySelector('.popup-best') // попап с топ 10
const popUpTopList = document.querySelector('.popup-list') // попап с топ 10
const buttonCloseTop = document.querySelector('.close-top-button')

let score;
let bestScore;
let grid;

//функция которая запускает новую игру 
function startNewGame() {
    if (score !== 0) saveGameResult(score);
    if (!popUpGameOver.classList.contains('visually-hidden'))  popUpGameOver.classList.add('visually-hidden');
    if (!popUpWin.classList.contains('visually-hidden')) popUpWin.classList.add('visually-hidden');
    gameBoard.innerHTML = '';
    score = 0;
    fieldScore.innerHTML = `${score}`;
    grid = new Grid(4);
    grid.createGrid(gameBoard);
    createTile();
    createTile();
    buttonNewGame.blur();
    listenKeyboardOneClick();
    showBestScore();
}

function endGame() {
    popUpGameOver.classList.remove('visually-hidden');
    saveGameResult(score);
    fieldGameoverScore.innerHTML = `${score}`;
    fieldGameoverBestScore.innerHTML = `${bestScore}`;
}

function showWin() {
    popUpWin.classList.remove('visually-hidden');
    fieldWinScore.innerHTML = `${score}`;
    fieldWinBestScore.innerHTML = `${bestScore}`;
}

function hideWin() {
    popUpWin.classList.add('visually-hidden');
}

function saveGameResult(value) {
    const games = localStorage.getItem('games');

    console.log(value);
    if (!games) {
        const data = JSON.stringify([{score: value}]);
        localStorage.setItem(`games`, data);
    } else {
        const parsedGames = JSON.parse(games);
        parsedGames.push({score: value});

        if (parsedGames.length > 10) {
            parsedGames.shift();
        }

        localStorage.setItem('games', JSON.stringify(parsedGames));
    }
}

function sortLocalStorage() {
    popUpTopList.innerHTML = ''
    let topResults = []
    let localStorageArray = JSON.parse(localStorage.games)
    for (let i = 0; i < localStorageArray.length; i++) {  
        topResults.push(localStorageArray[i].score)
    }

    let topSortedResults = topResults.sort((a, b) => b - a)
    return topSortedResults
}

function createTop() {
    popUpTopList.innerHTML = ''
    let topArray = sortLocalStorage()

    topArray.forEach((el, index) => {
        popUpTopList.insertAdjacentHTML("beforeend",
            `<li class="top-item">
                <span>${index + 1} place score: ${el} </span>
            </li>`
        );
    });
}

function showTop() {
    createTop();
    popUpTop.classList.toggle("visually-hidden");
}

function showBestScore() {
    let topArray = sortLocalStorage();
    console.log(topArray)
    bestScore = topArray[0];
    fieldBestScore.innerHTML = `${bestScore}`;
}

document.addEventListener("DOMContentLoaded", startNewGame); 
buttonNewGame.addEventListener("click", startNewGame);
buttonGameoverNewGame.addEventListener("click", startNewGame);
buttonWinNewGame.addEventListener("click", startNewGame);
buttonWinContinue.addEventListener("click", hideWin);
buttonTop.addEventListener("click", showTop);
buttonCloseTop.addEventListener("click", showTop);

// функция создания новую плитки и связаваем ее с рандомной пустой ячейкой
function createTile() {
    let tile = new Tile(gameBoard);
    let emptyCell = grid.getRandomEmptyCell();
    emptyCell.linkTile(tile);
    return tile;
}

// функция, которая слушает нажатие клавишы 1 раз
function listenKeyboardOneClick() {
    window.addEventListener("keydown", handleInput, {once: true});
}

//функция, которая выполняет перемещение ячеек в зависимости от нажатой клавиши
async function handleInput(evt) {
    switch (evt.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                listenKeyboardOneClick();
                return;
            }
            
            await moveUp()
            break;

        case "ArrowDown":
            if (!canMoveDown()) {
                listenKeyboardOneClick();
                return;
            }

            await moveDown();
            break;

        case "ArrowLeft":
            if (!canMoveLeft()) {
                listenKeyboardOneClick();
                return;
            }

            await moveLeft();
            break;

        case "ArrowRight":
            if (!canMoveRight()) {
                listenKeyboardOneClick();
                return;
            }

            await moveRight();
            break;
        default:
            listenKeyboardOneClick();
            return;
    }

    const newTile = createTile()

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd();
        endGame();
        return;
    }

    listenKeyboardOneClick();
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
    groupedCells.forEach(group => slideTilesInGroup(group, promises));

    await Promise.all(promises);

    grid.cells.forEach(cell => {
        if (cell.hasTileForMerge()) {
            let newScore = cell.mergeTiles();
            score = score + newScore;
            fieldScore.innerHTML = `${score}`;


            if (newScore === 2048) {
                showWin();
            }
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
    return canMove(grid.cellsGroupedByColumn());
}

function canMoveDown() {
    return canMove(grid.cellsGroupedByReversedColumn());
}

function canMoveLeft() {
    return canMove(grid.cellsGroupedByRow());
}

function canMoveRight() {
    return canMove(grid.cellsGroupedByReversedRow());
}

function canMove(groupedCells) {
    return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
    return group.some((cell, index) => {
        if (index === 0) {
            return false;
        }

        if (cell.isEmpty()) {
            return false;
        }

        const targetCell = group[index - 1];
        return targetCell.canAccept(cell.linkedTile);
    });
}


