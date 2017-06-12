'use strict';

/** Class ViewPort */
class ViewPort {

  /**
   * ViewPort constructor
   */
  constructor(canvasSize) {
    console.log('ViewPort:constructor');

    this.offset = new Vector2(0, 0);

    this._viewPortThreshold = new Vector2(192, 128);
    this._canvasCenter = new Vector2(canvasSize.x/2, canvasSize.y/2);

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
   *
   * @param {float} delta - Game Update delta time
   */
  update(delta, playerPosition) {

    let v = new Vector2(0, 0);

    if (this.offset.x > playerPosition.x - (this._canvasCenter.x - this._viewPortThreshold.x)) {
      v.x -= this._speed.x * delta;
    }
    if (this.offset.x < playerPosition.x - (this._canvasCenter.x + this._viewPortThreshold.x)) {
      v.x += this._speed.x * delta;
    }
    if (this.offset.y > playerPosition.y - (this._canvasCenter.y - this._viewPortThreshold.y)) {
      v.y -= this._speed.y * delta;
    }
    if (this.offset.y < playerPosition.y - (this._canvasCenter.y + this._viewPortThreshold.y)) {
      v.y += this._speed.y * delta;
    }

    this.offset.x += v.x;
    this.offset.y += v.y;
  }

}
