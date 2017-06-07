'use strict';

class Map {

  constructor(input) {

    this.input = input;

    this._viewRes = new Vector2(0, 0);
    this._viewOffset = new Vector2(0, 0);

    this._viewSpeed = 30;

    this._fillColours = [
      'red',
      'blue',
      'green',
    ];

    this._init();
  }

  _init(viewRes) {
    this._viewRes = viewRes;
  }

  update(tick) {
    if (this.input.UP) {
      this._viewOffset.y += this._viewSpeed * tick;
    }
    if (this.input.DOWN) {
      this._viewOffset.y -= this._viewSpeed * tick;
    }
    if (this.input.LEFT) {
      this._viewOffset.x -= this._viewSpeed * tick;
    }
    if (this.input.RIGHT) {
      this._viewOffset.x += this._viewSpeed * tick;
    }

  }

  render(context, delta) {

    for(let x = 0; x < 100; x++) {
      for(let y = 0; y < 100; y++) {
        context.fillStyle = this._fillColours[(x+y) % this._fillColours.length];
        context.fillRect(
          (10 * x) - this._viewOffset.x,
          (10 * y) - this._viewOffset.y,
          10,
          10
        );
      }
    }
  }

}
