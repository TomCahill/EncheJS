'use strict';

/** Class Map */
class Map {

  /**
   * Map constructor
   * @param {object} input - Game Input Manager
   */
  constructor(input) {
    console.log('Map:constructor');

    this.input = input;

    this._viewOffset = new Vector2(0, 0);

    this._viewSpeed = 30;

    this._fillColours = [
      'red',
      'blue',
      'green',
    ];

    this._init();
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('Map:_init');
  }

  /**
   *
   * @param {float} delta - Game Update delta time
   */
  update(delta) {
    // console.log('Map:update');
    if (this.input.UP) {
      this._viewOffset.y += this._viewSpeed * delta;
    }
    if (this.input.DOWN) {
      this._viewOffset.y -= this._viewSpeed * delta;
    }
    if (this.input.LEFT) {
      this._viewOffset.x -= this._viewSpeed * delta;
    }
    if (this.input.RIGHT) {
      this._viewOffset.x += this._viewSpeed * delta;
    }
  }

  /**
   *
   * @param {object} context - Game canvas context
   */
  render(context) {
    // console.log('Map:render');
    for (let x = 0; x < 100; x++) {
      for (let y = 0; y < 100; y++) {
        context.fillStyle = this._fillColours[(x+y) % this._fillColours.length];
        context.fillRect(
          (50 * x) - this._viewOffset.x,
          (50 * y) - this._viewOffset.y,
          50,
          50
        );
      }
    }
  }

}
