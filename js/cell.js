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

    // функция отвязывает плитку от ячейки
    unlinkTile() {
        this.linkedTile = null;
    }

    // возвращает true или false в зависимости пустая ячейка или к ней уже привязана плитка
    isEmpty() {
        return !this.linkedTile;
    }

    // привязыввет к ячейке 2 плитку, которую нужно обЪединить с уже привязанной
    linkTileForMerge(tile) {
        tile.setXY(this.x, this.y);
        this.linkedTileForMerge = tile;
    }

    // функция отвязывает плитку для смерживания от ячейки
    unlinkTileForMerge() {
        this.linkedTileForMerge = null;
    }

    // проверка имеет ли ячейка связанную плитку для смерживания
    hasTileForMerge() {
        return !!this.linkedTileForMerge;
    }

    //проверка может ли ячейка принять новую при перемещении. Возвращает true
    // если ячейка пустая,
    // 1) если у ячейки есть своя плитка, но еще нет второй плитки - привязанной для объединения, и 2)значение своей плитки совпадает со значение переданной в аргументе плитки
    canAccept(newTile) {
        return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.tileValue === newTile.tileValue);
    }

    //функция объединения плиток, если у них одинаковые значения
    mergeTiles() {
        this.linkedTile.setValue(this.linkedTile.tileValue + this.linkedTileForMerge.tileValue)
        this.linkedTileForMerge.removeFromDOM();
        this.unlinkTileForMerge();
    }
}