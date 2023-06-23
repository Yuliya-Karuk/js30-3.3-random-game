import { Cell } from "./cell.js";

export class Grid {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.cellsCount = gridSize * gridSize;
        this.cells = []
    }

    // создает поле с ячейками
    createGrid(gridElement) {
        for (let i = 0; i < this.cellsCount; i++) {
            this.cells.push(
                new Cell(gridElement, i % this.gridSize, Math.floor(i/this.gridSize))
            )
        }
    }

    // функция, которая группирует ячейки по стобцам. Получается массив из 4 массивов
    cellsGroupedByColumn() {
        return this.cells.reduce(((groupedCells, cell, index) => {
            groupedCells[index % this.gridSize].push(cell);
            return groupedCells;
        }), [[], [], [], []])
    }

    // берет случайную пустую ячейку на всей доске
    getRandomEmptyCell() {
        const emptyCells = this.cells.filter(cell => cell.isEmpty());
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex]
    }
}