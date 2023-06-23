export class Tile {
    constructor(gridElement) {
        this.tileElement = document.createElement("li");
        this.tileElement.classList.add("tile");
        this.setValue(Math.random() > 0.5 ? 2 : 4)
        gridElement.append(this.tileElement)
    }

    // меняет значение x и y плитки на новые, и меняет их в CSS файле
    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.tileElement.style.setProperty("--x", this.x);
        this.tileElement.style.setProperty("--y", this.y);
    }

    // функция, которая устанавливает цвет фона и шрифта в зависимости от значения плитки
    setValue(value) {
        this.tileValue = value;
        this.tileElement.textContent = this.tileValue;
        const bgLightness = 100 - Math.log2(this.tileValue) * 9;
        this.tileElement.style.setProperty("--bg-lightness", `${bgLightness}%`);
        this.tileElement.style.setProperty("--text-lightness", `${bgLightness < 50 ? 90 : 10}%`);
    }

    // функция, которая удаляет плитку
    removeFromDOM() {
        this.tileElement.remove();
    }

    waitForTransitionEnd() {
        return new Promise(resolve => {
            this.tileElement.addEventListener("transitionend", resolve, {once: true});
        })
    }

    waitForAnimationEnd() {
        return new Promise(resolve => {
            this.tileElement.addEventListener("animationend", resolve, {once: true});
        })
    }
}