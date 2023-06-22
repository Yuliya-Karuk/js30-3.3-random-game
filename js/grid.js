import { Cell } from "./cell.js";

export class Grid {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.cellsCount = gridSize * gridSize;
        this.cells = []
    }

    // создает поле с клетками
    createGrid(gridElement) {
        for (let i = 0; i < this.cellsCount; i++) {
            this.cells.push(
                new Cell(gridElement, i % this.gridSize, Math.floor(i/this.gridSize))
            )
        }
    }

    // берет случайную пустую ячейку на всей доске
    getRandomEmptyCell() {
        const emptyCells = this.cells.filter(cell => cell.isEmpty());
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex]
    }
}