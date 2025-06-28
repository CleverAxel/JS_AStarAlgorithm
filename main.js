import { Grid, GRID_MODE } from "./grid.js";

const CELL_DIMENSION = 25;
const COLUMN_LENGTH = 40;
const ROW_LENGTH = 30;

const _CANVAS = document.querySelector("canvas");
const FPS_COUNTER = document.querySelector("#fps_counter");
const CTX = _CANVAS.getContext("2d");
const GRID = new Grid(COLUMN_LENGTH, ROW_LENGTH, CELL_DIMENSION, _CANVAS);

export const STOP_WATCH = document.querySelector("#stopwatch span");

document.querySelector("button").addEventListener("click", () => {
    GRID.aStar.reset();
    const now = performance.now();
    if (GRID.aStar.scan())
        STOP_WATCH.innerHTML = performance.now() - now;
    else
        STOP_WATCH.innerHTML = "?";
    // console.log(performance.now() - now);
});

/**@type {HTMLInputElement} */
const SELECT_MODE_INPUT = document.getElementById("grid_mode");
setOptionsInSelect(GRID_MODE.BUILD, "PLACER OBSTACLES", true);
setOptionsInSelect(GRID_MODE.PLACE_START, "PLACER DEPART");
setOptionsInSelect(GRID_MODE.PLACE_END, "PLACER FIN");

SELECT_MODE_INPUT.addEventListener("change", () => {
    GRID.mode = parseInt(SELECT_MODE_INPUT.value);
});


let endTick = performance.now();

function render(startTick) {
    const elapsed = startTick - endTick;
    const dT = elapsed / 1000;
    endTick = startTick;

    // FPS_COUNTER.textContent = `${Math.floor(1 / dT)}`;

    CTX.clearRect(0, 0, _CANVAS.width, _CANVAS.height);
    GRID.update();
    GRID.render();
    requestAnimationFrame(render);
}

requestAnimationFrame(render);

function setOptionsInSelect(value, label, selected = false) {
    let option = document.createElement("option");
    option.value = value;
    option.innerText = label;
    option.selected = selected;
    SELECT_MODE_INPUT.appendChild(option);
}

