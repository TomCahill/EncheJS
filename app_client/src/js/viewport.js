'use strict';

/** Class ViewPort */
class ViewPort { // eslint-disable-line no-unused-vars

  /**
   * ViewPort constructor
   * @param {Vector2} canvasSize
   */
  constructor(canvasSize) {
    console.log('ViewPort:constructor');

    this.offset = new Vector2(0, 0);

    this._viewPortThreshold = new Vector2(192, 128);
    this._canvasCenter = new Vector2(canvasSize.x / 2, canvasSize.y / 2);

    this._speed = new Vector2(200, 200);

    this._init();
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('ViewPort:_init');
  }

  /**
   *
   * @param {float} delta - DeltaTime
   * @param {Vector2} playerPosition
   */
  update(delta, playerPosition) {
    if (!playerPosition) {
      return;
    }

    this.offset.x = playerPosition.x - this._canvasCenter.x + 32;
    this.offset.y = playerPosition.y - this._canvasCenter.y + 32;
  }

}
