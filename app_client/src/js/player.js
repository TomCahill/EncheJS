'use strict';

/** Class Player */
class Player extends Object {

  /**
   * Player constructor
   */
  constructor(Input) {
    super();
    console.log('Player:constructor');

    this.input = Input;

    this.position = null;
    this.sprite = null;

    this.speed = 150;

    this.moving = false;
    this.startPosition = null;
    this.movePosition = null;

    this._init();
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('Player:_init');
    this.position = new Vector2(950, 515);

    this.sprite = document.createElement('img');
    this.sprite.setAttribute('src', '/assets/images/sprites/player.png');
  }

  update(delta) {
    // console.log('Player:update');
    if (!this.moving) {
      if (this.input.UP) {
        this.position.y -= this.speed * delta;
      }
      if (this.input.DOWN) {
        this.position.y += this.speed * delta;
      }
      if (this.input.LEFT) {
        this.position.x -= this.speed * delta;
      }
      if (this.input.RIGHT) {
        this.position.x += this.speed * delta;
      }
    }
  }

  render(context, viewOffset) {
    // console.log('Player:render');
    context.drawImage(this.sprite, 0, 0, 64, 64, (this.position.x - viewOffset.x), (this.position.y - viewOffset.y), 64, 64);
  }

}
