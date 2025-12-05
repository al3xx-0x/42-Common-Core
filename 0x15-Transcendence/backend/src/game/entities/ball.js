const { Point, randomrange } = require("./point");

class Ball {
    constructor( position, radius ) {
        this.position = position;
        this.radius = radius;
        this.direction = new Point( -1, 1 );
        this.speed = 8;
        this.velocity = new Point( this.direction.x * this.speed, this.direction.y * this.speed );
    }
}

module.exports = { Ball };