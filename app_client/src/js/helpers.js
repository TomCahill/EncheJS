'use strict';

/** Class Vector2 */
class Vector2 { // eslint-disable-line no-unused-vars

  /**
   *
   * @param {float} x - Vector X
   * @param {float} y - Vector Y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   *
   * @return {string} - Dumps out X Y as a combined string
   */
  toString() {
    return `${this.x}:${this.y}`;
  }

}
