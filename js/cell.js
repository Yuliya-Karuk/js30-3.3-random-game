export class Cell {
    constructor(gridElement, x, y) {
        const cell = document.createElement("li");
        cell.classList.add("cell")
        gridElement.append(cell)
        this.x = x;
        this.y = y;
    }
}