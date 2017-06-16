'use strict';

/** Class Input */
class Input { // eslint-disable-line no-unused-vars

  /**
   * Input constructor
   */
  constructor() {
    this.UP = 0;
    this.DOWN = 0;
    this.LEFT = 0;
    this.RIGHT = 0;
    this.SPRINT = 0;

    this._init();
  }

  /**
   *
   * @private
   */
  _init() {
    document.addEventListener('keydown', this._keyDown.bind(this));
    document.addEventListener('keyup', this._keyUp.bind(this));
  }

  /**
   *
   * @param {object} ev - KeyboardEvent
   * @private
   */
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
      case 16:
        this.SPRINT = 1;
        break;
    }
  }

  /**
   *
   * @param {object} ev - KeyboardEvent
   * @private
   */
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
      case 16:
        this.SPRINT = 0;
        break;
    }
  }

}
