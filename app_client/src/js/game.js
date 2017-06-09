'use strict';

/** Class Game */
class Game {

  /**
   * Game constructor
   * @param {string} gameMainFrameId - Main game canvas element id
   */
  constructor(gameMainFrameId) {
    console.log('Game:constructor');

    this.socket = null;
    this.input = null;
    this.network = null;
    this.canvas = null;
    this.map = null;

    this._lastFrame = 0;
    this._deltaTime = 0;
    this._tickRate = 1/60;

    this._init(gameMainFrameId);
  }

  /**
   *
   * @param {string} gameMainFrameId  - Main game canvas element id
   * @private
   */
  _init(gameMainFrameId) {
    console.log('Game:_init');
    this.input = new Input();
    this.canvas = new Canvas(gameMainFrameId);

    this.map = new Map(this.input);

    this.network = new Network();

    this._main();
  }

  /**
   *
   * @private
   */
  _main() {
    // console.log('Game:_main');
    window.requestAnimationFrame(this._main.bind(this));

    const now = new Date();
    this._deltaTime += Math.min(1, (now - this._lastFrame) / 1000);

    while (this._deltaTime > this._tickRate) {
      this._deltaTime = this._deltaTime - this._tickRate;
      this._update(this._deltaTime);
    }

    this._render(this.canvas.context);

    this._lastFrame = now;
  }

  /**
   *
   * @param {float} delta - Game Update delta time
   * @private
   */
  _update(delta) {
    // console.log('Game:_update');
    this.map.update(delta);
  }

  /**
   *
   * @param {object} context - Game canvas context
   * @private
   */
  _render(context) {
    // console.log('Game:_render');
    context.clearRect(0, 0, this.canvas.size.x, this.canvas.size.y);

    this.map.render(context);
  }

}
