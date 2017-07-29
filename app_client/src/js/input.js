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

    this.keyboardMap = {
      '87': 'UP',
      '65': 'LEFT',
      '83': 'DOWN',
      '68': 'RIGHT',
      '16': 'SPRINT',
    };
    this.mobileMap = {
      'movement-up': 'UP',
      'movement-left': 'LEFT',
      'movement-down': 'DOWN',
      'movement-right': 'RIGHT',
      'interaction-sprint': 'SPRINT',
    };

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
   * @param {string} element - Mobile container element id
   */
  initMobileListeners(element) {
    let buttons = document.getElementById(element).querySelectorAll('button');

    let touchStartEvent = 'mousedown';
    let touchEndEvent = 'mouseup';

    if ('onpointerdown' in window) {
      touchStartEvent = 'pointerdown';
      touchEndEvent = 'pointerup';
    } else if ('ontouchstart' in window) {
      touchStartEvent = 'touchstat';
      touchEndEvent = 'touchend';
    }

    buttons.forEach((button) => {
      button.addEventListener(touchStartEvent, this._mouseDown.bind(this));
      button.addEventListener(touchEndEvent, this._mouseUp.bind(this));
    });
  }

  /**
   *
   * @param {object} ev - KeyboardEvent
   * @private
   */
  _mouseDown(ev) {
    let className = ev.target.className;
    const input = this.mobileMap[className];
    this[input] = 1;
  }

  /**
   *
   * @param {object} ev - KeyboardEvent
   * @private
   */
  _mouseUp(ev) {
    let className = ev.target.className;
    const input = this.mobileMap[className];
    this[input] = 0;
  }

  /**
   *
   * @param {object} ev - KeyboardEvent
   * @private
   */
  _keyDown(ev) {
    const input = this.keyboardMap[ev.keyCode];
    this[input] = 1;
  }

  /**
   *
   * @param {object} ev - KeyboardEvent
   * @private
   */
  _keyUp(ev) {
    const input = this.keyboardMap[ev.keyCode];
    this[input] = 0;
  }

}
