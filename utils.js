import { DIAGONAL_COST, NORMAL_COST } from "./astar.js";
import { Vector2 } from "./vector2.js";

/**
 * @param {number} width 
 * @param {Vector2} coordinate 
 */
export function coordinateToIndex(width, coordinate) {
    return coordinate.y * width + coordinate.x;
}

/**
 * @param {number} width 
 * @param {number} index 
 */
export function indexToCoordinate(width, index) {
    return new Vector2(index % width, Math.floor(index / width));
}

/**
 * @param {Vector2} a 
 * @param {Vector2} b 
 */
export function manhattanDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * @param {Vector2} current 
 * @param {Vector2} target 
 */
export function octileDistance(current, target, D = NORMAL_COST, D2 = DIAGONAL_COST) {
    const dx = Math.abs(current.x - target.x);
    const dy = Math.abs(current.y - target.y);

    return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Vector2} a 
 * @param {Vector2} b 
 */
export function line(ctx, a, b, color = "#ed8cdb") {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
}