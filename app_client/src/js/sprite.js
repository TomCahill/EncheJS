'use strict';

/** Class Sprite */
class Sprite {

  /**
   * Sprite constructor
   */
  constructor(spritePath) {
    console.log('Sprite:constructor');

    this._sprite = null;
    this._loaded = false;
    this._size = null;
    this._offset = null;

    this._animations = {};

    this._animation = null;
    this._frame = 0;
    this._lastFrameTime = 0;

    this._init(spritePath);
    this.load(spritePath);
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('Sprite:_init');

    this._sprite = new Image();

    this._size = new Vector2(64, 64);
  }

  load(spritePath) {
    console.log('Sprite:load', spritePath);
    this._sprite.src = `/assets/images/sprites/${spritePath}.png`;
    this._sprite.onload = () => {
      this._loaded = true;
    }
  }

  loaded() {
    // console.log('Sprite:loaded', this._loaded);
    return this._loaded;
  }

  animate(key) {
    console.log('Sprite:animate', key);
    this._animation = this._animations[key];
    this._lastFrame = 0;
    this._lastFrameTime = 0;
  }

  addAnimation(key, data) {
    console.log('Sprite:addAnimation', key, data);
    this._animations[key] = data;
  }

  /**
   *
   *
   * @param {float} delta - Game Update delta time
   */
  update(delta) {
    var now = new Date();

    if (!this._animation) {
      return;
    }

    if (!this._animation.frameCount || !this._animation.speed) {
      return;
    }

    if (now - this._lastFrameTime > this._animation.speed) {
      this._frame++;
      if (this._frame > this._animation.frameCount - 1) {
        this._frame = 0;
      }

      this._lastFrameTime = now;
    }
  }

  /**
   *
   *
   * @param {object} context - Canvas
   */
  render(context, worldPosition) {
    if (!this._loaded) {
      return;
    }

    let dY = 0;

    if (this._animation) {
      dY = this._animation.row * this._size.y;
    }

    context.drawImage(
      this._sprite, // Sprite
      (this._frame * this._size.x), // dX
      dY, // dY
      this._size.x, // dWidth
      this._size.y, // dHeight
      worldPosition.x, // sX
      worldPosition.y, // sY
      this._size.x, // sWidth
      this._size.y // sHeight
    );
  }

}
