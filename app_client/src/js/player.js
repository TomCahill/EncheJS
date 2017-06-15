'use strict';

/** Class Player */
class Player extends Object {

  /**
   * Player constructor
   * @param {Input} Input - Game Input Manager
   * @param {Map} Map - Map Manager
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
    this.position = this.map.getWorldPosition(new Vector2(12, 6));

    this.sprite = new Sprite('player');
    this.sprite.addAnimation('idle', {
      row: 0,
    });
    this.sprite.addAnimation('down', {
      frameCount: 3,
      row: 0,
      speed: 100,
    });
    this.sprite.addAnimation('left', {
      frameCount: 3,
      row: 1,
      speed: 100,
    });
    this.sprite.addAnimation('up', {
      frameCount: 3,
      row: 2,
      speed: 100,
    });
    this.sprite.addAnimation('right', {
      frameCount: 3,
      row: 3,
      speed: 100,
    });

    this._loaded = true;
  }

  /**
   *
   * @param {float} delta - DeltaTime
   */
  update(delta) {
    // console.log('Player:update');
    if (!this._loaded) {
      if (this.map.loaded()) {
        this._init();
      }

      return;
    }

    if (!this.moving) {
      if (this.input.UP) {
        this.moveTo(0, -1);
        this.sprite.animate('up');
      }
      if (this.input.DOWN) {
        this.moveTo(0, 1);
        this.sprite.animate('down');
      }
      if (this.input.LEFT) {
        this.moveTo(-1, 0);
        this.sprite.animate('left');
      }
      if (this.input.RIGHT) {
        this.moveTo(1, 0);
        this.sprite.animate('right');
      }
      if (!this.moving) {
        this.sprite.animate('idle');
      }
    }

    if (this.moving) {
      let distance = new Vector2(
        Math.abs(this.position.x - this.targetPosition.x),
        Math.abs(this.position.y - this.targetPosition.y)
      );

      if (distance.x < this.speed * delta && distance.y < this.speed * delta) {
        this.position = new Vector2(
          this.targetPosition.x,
          this.targetPosition.y
        );
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

    this.sprite.update(delta);
  }

  /**
   *
   * @param {int} relX - Relative grid position X
   * @param {int} relY - Relative grid position Y
   */
  moveTo(relX, relY) {
    const gridPosition = this.map.getGridPosition(this.position);
    const targetGridPosition = new Vector2(
      gridPosition.x + relX,
      gridPosition.y + relY
    );

    if (!this.map.isTileTraversable(targetGridPosition)) {
      return;
    }

    this.targetPosition = this.map.getWorldPosition(targetGridPosition);
    this.moving = true;
  }

  /**
   *
   * @param {object} context - Game canvas context
   * @param {Vector2} viewOffset - Viewport manager offset
   */
  render(context, viewOffset) {
    // console.log('Player:render');
    if (!this._loaded) {
      return;
    }
    if (!this.sprite.loaded()) {}

    this.sprite.render(
      context,
      new Vector2(
        (this.position.x - viewOffset.x),
        (this.position.y - viewOffset.y)
      )
    );
  }

}
