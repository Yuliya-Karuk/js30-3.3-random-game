export class Cell {
    constructor(gridElement, x, y) {
        const cell = document.createElement("li");
        cell.classList.add("cell")
        gridElement.append(cell)
        this.x = x;
        this.y = y;
    }

    //связывает пустую ячейку с плиточкой
    linkTile(tile) {
        tile.setXY(this.x, this.y);
        this.linkedTile = tile;
    }

    // возвращает true или false в зависимости привязана ли к ячейке плиточка
    isEmpty() {
        return !this.linkedTile;
    }
}