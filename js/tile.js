export class Tile {
    constructor(gridElement) {
        this.tileElement = document.createElement("li");
        this.tileElement.classList.add("tile");
        this.tileValue = Math.random() > 0.5 ? 2 : 4;
        this.tileElement.textContent = this.tileValue
        gridElement.append(this.tileElement)
    }

    // меняет значение x и y плитки на новые, и меняет их в CSS файле
    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.tileElement.style.setProperty("--x", this.x)
        this.tileElement.style.setProperty("--y", this.y)
    }
}