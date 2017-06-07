'use strict';

class Input {

  constructor() {

    this.UP = 0;
    this.DOWN = 0;
    this.LEFT = 0;
    this.RIGHT = 0;

    this._init();
  }

  _init() {
    document.addEventListener("keydown", this._keyDown.bind(this));
    document.addEventListener("keyup", this._keyUp.bind(this));
  }

  _keyDown(ev) {
    switch (ev.keyCode) {
      case 87:
        this.UP = 1;
        break;
      case 83:
        this.DOWN = 1;
        break;
      case 65:
        this.LEFT = 1;
        break;
      case 68:
        this.RIGHT = 1;
        break;
    }
  }

  _keyUp(ev) {
    switch (ev.keyCode) {
      case 87:
        this.UP = 0;
        break;
      case 83:
        this.DOWN = 0;
        break;
      case 65:
        this.LEFT = 0;
        break;
      case 68:
        this.RIGHT = 0;
        break;
    }
  }

}
