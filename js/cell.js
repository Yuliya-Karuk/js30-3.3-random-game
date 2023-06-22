export class Cell {
    constructor(gridElement, x, y) {
        const cell = document.createElement("li");
        cell.classList.add("cell")
        gridElement.append(cell)
        this.x = x;
        this.y = y;
    }

    //связывает пустую ячейку с плиткой
    linkTile(tile) {
        tile.setXY(this.x, this.y);
        this.linkedTile = tile;
    }

    // возвращает true или false в зависимости пустая ячейка или к ней уже привязана плитка
    isEmpty() {
        return !this.linkedTile;
    }
}