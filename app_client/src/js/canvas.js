'use strict';

/** Class Canvas */
class Canvas { // eslint-disable-line no-unused-vars

  /**
   * Canvas constructor
   * @param {string} elementId - Canvas Element ID
   */
  constructor(elementId) {
    console.log('Canvas:constructor');
    this.element = document.getElementById(elementId);
    this.context = this.element.getContext('2d');

    this.ratio = 0;

    this.size = new Vector2(0, 0);

    this._init();
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('Canvas:_init');

    this.size = new Vector2(window.innerWidth, window.innerHeight);

    this._listeners();

    this._resizeViewPort();
  }

  /**
   *
   * @private
   */
  _listeners() {
    console.log('Canvas:_listeners');
    window.addEventListener('resize', this._resizeViewPort.bind(this));
  }

  /**
   *
   * @private
   */
  _resizeViewPort() {
    console.log('Canvas:_resizeViewPort');
    this.size = new Vector2(window.innerWidth, window.innerHeight);
    this.ratio = Canvas.devicePixelRatio(this.context);

    this.element.width = this.size.x * this.ratio;
    this.element.height = this.size.y * this.ratio;
    this.element.style.width = this.size.x + 'px';
    this.element.style.height = this.size.y + 'px';

    this.context.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
  }

  /**
   *
   * @param {string} context - Canvas Context
   * @return {number} ratio - Device pixel ratio
   */
  static devicePixelRatio(context) {
    console.log('Canvas:devicePixelRatio');
    const dpr = window.devicePixelRatio || 1;
    const bsr = context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;

    return dpr / bsr;
  }

}
