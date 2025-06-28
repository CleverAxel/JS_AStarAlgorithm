import { AStar } from "./astar.js";
import { STOP_WATCH } from "./main.js";
import { coordinateToIndex, line } from "./utils.js";
import { Vector2 } from "./vector2.js";

export const GRID_MODE = Object.freeze({
    BUILD: 0,
    PLACE_START: 1,
    PLACE_END: 2,
});


export class Grid {

    /**
     * @param {number} columnLength 
     * @param {number} rowLength 
     * @param {number} cellSize 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(columnLength, rowLength, cellSize, canvas) {
        this.columnWidth = columnLength;
        this.rowHeight = rowLength;
        this.cellSize = cellSize;

        this.isMouseDown = false;

        this.canvas = canvas;
        this.canvas.width = cellSize * columnLength;
        this.canvas.height = cellSize * rowLength;

        this.ctx = canvas.getContext("2d");

        this.mousePosition = new Vector2(0, 0);
        this.oldMousePosition = new Vector2(-1, -1);

        this.offsetPosition = new Vector2(0, 0);

        this.aStar = new AStar();

        this.aStar.columnWidth = this.columnWidth;
        this.aStar.rowHeight = this.rowHeight;
        this.aStar.cellSize = cellSize;

        this.mousePositionChanged = false;
        this.mouseInGrid = false;


        this.mode = GRID_MODE.BUILD;
        this.recalculatePathEachFrame = false;
        this.displayGrid = false;

        this.initEventListeners();

        this.startTick = 0;
        this.endTick = performance.now();
        this.timer = 0;

        //timeout here it will calculate the new path every 100ms. 
        this.recalculatePathTimeout = 100;

    }

    initEventListeners() {
        window.addEventListener("mousedown", () => {
            this.isMouseDown = true;
            if (this.mode == GRID_MODE.BUILD && this.mouseInGrid) {
                this.addObstacleToList();
            }
            else if (this.mode == GRID_MODE.PLACE_START && this.mouseInGrid) {
                this.setStartPoint();
            }
            else if (this.mode == GRID_MODE.PLACE_END && this.mouseInGrid) {
                this.setEndPointAndRecalculatePath();
            }

            document.getElementById("constant_path_calculation").addEventListener("change", (e) => {
                this.recalculatePathEachFrame = e.target.checked;
            })
            document.getElementById("display_grid").addEventListener("change", (e) => {
                this.displayGrid = e.target.checked;
            })
        });

        window.addEventListener("mouseup", () => this.isMouseDown = false);
        this.canvas.addEventListener("mousemove", (e) => {
            this.mousePosition.set(Math.floor(e.offsetX / this.cellSize), Math.floor(e.offsetY / this.cellSize));
            this.offsetPosition.set(e.offsetX, e.offsetY);
        });
        this.canvas.addEventListener("mouseleave", () => this.mouseInGrid = false);
        this.canvas.addEventListener("mouseenter", () => this.mouseInGrid = true);
    }

    update() {



        if (this.recalculatePathEachFrame) {
            this.startTick = performance.now();

            const elapsed = this.startTick - this.endTick;
            this.endTick = this.startTick;

            this.timer += elapsed;

            if (this.timer >= this.recalculatePathTimeout) {
                this.timer -= this.recalculatePathTimeout;
                this.aStar.reset();
                const now = performance.now();
                if (this.aStar.scan())
                    STOP_WATCH.innerHTML = performance.now() - now;
                else
                    STOP_WATCH.innerHTML = "?";
            }
        }

        //doesn't run if the mouse position doesn't change of cell
        if (this.mousePosition.equals(this.oldMousePosition) || !this.mouseInGrid) {
            return;
        }

        if (this.mode == GRID_MODE.BUILD) {
            this.addObstacleToList();
        }

        else if (this.mode == GRID_MODE.PLACE_START) {
            this.setStartPoint();
        }

        else if (this.mode == GRID_MODE.PLACE_END) {
            this.setEndPointAndRecalculatePath();

        }



        this.oldMousePosition.set(this.mousePosition.x, this.mousePosition.y);

    }

    render() {
        this.renderObstacles();
        this.renderStartPoint();
        this.renderEndPoint();
        this.renderResolvedPath();

        if (this.displayGrid)
            this.renderGrid();
    }

    renderResolvedPath() {
        if (this.aStar.foundTarget) {
            for (let i = 1; i < this.aStar.resolvedPath.length; i++) {
                line(this.ctx, this.aStar.resolvedPath[i - 1], this.aStar.resolvedPath[i]);
                // this.line(this.aStar.resolvedPath[i - 1], this.aStar.resolvedPath[i]);
            }
        }
    }

    renderVisited() {
        for (let i = 0; i < this.aStar.visited.length; i++) {
            const position = this.aStar.visited[i].position;
            this.ctx.fillStyle = "#a9b598";
            this.ctx.beginPath();
            this.ctx.rect(position.x * this.cellSize, position.y * this.cellSize, this.cellSize, this.cellSize);
            this.ctx.fill();
        }
    }

    /**@private */
    renderObstacles() {

        for (const obstacle of this.aStar.obstacles.values()) {
            this.ctx.fillStyle = "#787878";
            this.ctx.beginPath();
            this.ctx.rect(obstacle.x * this.cellSize, obstacle.y * this.cellSize, this.cellSize, this.cellSize);
            this.ctx.fill();
        }
    }

    /**@private */
    renderGrid() {
        for (let i = 1; i < this.columnWidth; i++) {
            this.ctx.strokeStyle = "black";
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize + 0.5, 0);
            this.ctx.lineTo(i * this.cellSize + 0.5, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 1; i < this.rowHeight; i++) {

            this.ctx.strokeStyle = "black";
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize + 0.5);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize + 0.5);
            this.ctx.stroke();
        }
    }

    renderStartPoint() {
        this.ctx.fillStyle = "#32a852";
        this.ctx.beginPath();
        this.ctx.rect(this.aStar.startPoint.x * this.cellSize, this.aStar.startPoint.y * this.cellSize, this.cellSize, this.cellSize);
        this.ctx.fill();
    }

    renderEndPoint() {
        this.ctx.fillStyle = "#d15a32";
        this.ctx.beginPath();
        this.ctx.rect(this.aStar.endPoint.x * this.cellSize, this.aStar.endPoint.y * this.cellSize, this.cellSize, this.cellSize);
        this.ctx.fill();
    }

    /**
     * @private
     */
    addObstacleToList() {
        if (!this.isMouseDown)
            return;

        const indexPosition = coordinateToIndex(this.columnWidth, this.mousePosition);

        if (this.aStar.obstacles.has(indexPosition)) {
            this.aStar.obstacles.delete(indexPosition);
        } else {
            this.aStar.obstacles.set(indexPosition, this.mousePosition.clone());
        }
    }

    setStartPoint() {
        if (!this.isMouseDown || this.aStar.endPoint.equals(this.mousePosition)) {
            return;
        }

        const indexPosition = coordinateToIndex(this.columnWidth, this.mousePosition);
        if (this.aStar.obstacles.has(indexPosition)) {
            return;
        }
        this.aStar.startPoint.set(this.mousePosition.x, this.mousePosition.y);
    }

    setEndPointAndRecalculatePath() {
        if (!this.isMouseDown || this.aStar.startPoint.equals(this.mousePosition)) {
            return;
        }

        const indexPosition = coordinateToIndex(this.columnWidth, this.mousePosition);
        if (this.aStar.obstacles.has(indexPosition)) {
            return;
        }

        // console.log("track");

        this.aStar.endPoint.set(this.mousePosition.x, this.mousePosition.y);
    }

    /**
     * @param {Vector2} a 
     * @param {Vector2} b 
     */
    line(a, b) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#ed8cdb";
        this.ctx.moveTo(a.x * this.cellSize + this.cellSize / 2, a.y * this.cellSize + this.cellSize / 2);
        this.ctx.lineTo(b.x * this.cellSize + this.cellSize / 2, b.y * this.cellSize + this.cellSize / 2);
        this.ctx.stroke();
    }
}