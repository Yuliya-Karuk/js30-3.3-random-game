import { Cell } from "./cell.js";

export class Grid {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.cellsCount = gridSize * gridSize;
        this.cells = []
    }

    createGrid(gridElement) {
        for (let i = 0; i < this.cellsCount; i++) {
            this.cells.push(
                new Cell(gridElement, i % this.gridSize, Math.floor(i/this.gridSize))
            )
        }
    }
}