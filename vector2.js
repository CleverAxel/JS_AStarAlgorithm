export class Vector2 {
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    /**
     * @param {Vector2} v 
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /**
     * @param {Vector2} v 
     */
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    div(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magnitudeSquared() {
        return this.x * this.x + this.y * this.y;
    }

    normalize() {
        const mag = this.magnitude();
                
        if (mag > 0) {
            this.div(mag);
        }
    }

    /**
     * @param {Vector2} v 
     */
    equals(v) {
        return v.x == this.x && v.y == this.y;
    }

    toString() {
        return JSON.stringify({ x: this.x, y: this.y });
    }
}