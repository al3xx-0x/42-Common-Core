class Point {
    constructor( x, y ) {
        this.x = x;
        this.y = y;
    }
}

function randomrange(min, max) {
    return Math.random() * (max - min) + min;
}

module.exports = { Point, randomrange };