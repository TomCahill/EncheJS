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
    this.viewPort = null;

    this.player = null;

    this._lastFrame = 0;
    this._lastTick = 0;
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

    this.viewPort = new ViewPort(this.canvas.size);

    this.map = new Map(this.input);

    this.player = new Player(this.input, this.map);

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

    if ((now - this._lastTick) > this._tickRate) {
      this._deltaTime = Math.min(1, (now - this._lastTick) / 1000);
      this._update(this._deltaTime);
      this._lastTick = now;
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
    this.player.update(delta);
    this.viewPort.update(delta, this.player.position);
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

    this.map.render(context, this.viewPort.offset);
    this.player.render(context, this.viewPort.offset);

    // Debug shit
    context.font = '20px Arial';
    context.fillStyle = '#FFF';
    context.fillText(`Player: ${this.player.position}`, 20, 40);
    context.fillText(`ViewPort: ${this.viewPort.offset}`, 20, 60);
    context.fillText(`Players: ${this.network.totalPlayers}`, 20, 100);
  }

}
