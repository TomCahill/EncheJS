'use strict';

/** Class Vector2 */
class Vector2 {

  /**
   *
   * @param {float} x - Vector X
   * @param {float} y - Vector Y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${this.x}:${this.y}`;
  }

}
