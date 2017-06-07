'use strict';

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Game {

  constructor(gameMainFrameId) {
    this.socket = null;
    this.input = null;

    this._gameMainFrame = document.getElementById(gameMainFrameId);
    this._gameContext = this._gameMainFrame.getContext('2d');

    this._lastFrame = 0;
    this._deltaTime = 0;
    this._tickRate = 1/60;

    this._viewScale = 0.0;

    this._gameResolution = new Vector2(1920, 1080);
    this._viewPort = new Vector2(window.innerWidth, window.innerHeight);
    this._gameViewPort = new Vector2(0, 0);

    this._map = null;

    this._init();
  }

  _init() {
    const socket = io.connect();

    this.input = new Input();

    this._gameViewPort.x = this._viewPort.x;
    this._gameViewPort.y = this._viewPort.x * this._gameResolution.y / this._gameResolution.y;

    this._gameMainFrame.style.width = this._gameViewPort.x;
    this._gameMainFrame.style.height = this._gameViewPort.y;

    this._map = new Map(this.input);

    this._network(socket);

    this._main();
  }

  _network(socket) {
    socket.on('connect', function() {
      console.log('socket', 'Connected');
    });
    socket.on('disconnect', function() {
      console.log('socket', 'Connected');
    });

    this.socket = socket;
  }

  _main() {

    window.requestAnimationFrame(this._main.bind(this));

    const now = new Date();
    this._deltaTime = this._deltaTime + Math.min(1, (now - this._lastFrame) / 1000);

    while (this._deltaTime > this._tickRate) {
      this._deltaTime = this._deltaTime - this._tickRate;
      this._update(this._tickRate);
    }

    this._render(this._gameContext, this._deltaTime);

    this._lastFrame = now;
  }

  _update(tick) {
    this._map.update(tick);
  }

  _render(context, delta) {
    context.clearRect(0, 0, this._gameViewPort.x, this._gameViewPort.y);

    this._map.render(context);
  }

}
