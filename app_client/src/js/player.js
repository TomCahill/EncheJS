'use strict';

/** Class Player */
class Player extends Object {

  /**
   * Player constructor
   */
  constructor(Input, Map) {
    super();
    console.log('Player:constructor');

    this.input = Input;
    this.map = Map;

    this._loaded = false;

    this.position = null;
    this.sprite = null;

    this.speed = 150;

    this.moving = false;
    this.startPosition = null;
    this.targetPosition = null;
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('Player:_init');
    this.position = this.map.getWorldPosition(15, 9);

    this.sprite = document.createElement('img');
    this.sprite.setAttribute('src', '/assets/images/sprites/player.png');

    this._loaded = true;
  }

  update(delta) {
    // console.log('Player:update');
    if (!this._loaded) {
      if(this.map.loaded()) {
        this._init();
      }

      return;
    }

    if (!this.moving) {
      if (this.input.UP) {
        this.moveTo(0, -1);
      }
      if (this.input.DOWN) {
        this.moveTo(0, 1);
      }
      if (this.input.LEFT) {
        this.moveTo(-1, 0);
      }
      if (this.input.RIGHT) {
        this.moveTo(1, 0);
      }
    }

    if (this.moving) {
      let distance = new Vector2(
        Math.abs(this.position.x - this.targetPosition.x),
        Math.abs(this.position.y - this.targetPosition.y)
      );

      if (distance.x < this.speed * delta && distance.y < this.speed * delta) {
        this.position = new Vector2(this.targetPosition.x, this.targetPosition.y);
      }

      if (this.position.x > this.targetPosition.x) {
        this.position.x -= this.speed * delta;
      } else if (this.position.x < this.targetPosition.x) {
        this.position.x += this.speed * delta;
      } else if (this.position.y > this.targetPosition.y) {
        this.position.y -= this.speed * delta;
      } else if (this.position.y < this.targetPosition.y) {
        this.position.y += this.speed * delta;
      } else {
        this.moving = false;
      }
    }

  }

  moveTo(relX, relY) {
    const gridPosition = this.map.getGridPosition(this.position);

    this.targetPosition = this.map.getWorldPosition(
      gridPosition.x + relX,
      gridPosition.y + relY
    );
    this.moving = true;
  }

  render(context, viewOffset) {
    // console.log('Player:render');
    if (!this._loaded) {
      return;
    }

    context.drawImage(this.sprite, 0, 0, 64, 64, (this.position.x - viewOffset.x), (this.position.y - viewOffset.y), 64, 64);
  }

}
