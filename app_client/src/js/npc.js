'use strict';

/** Class NPC */
class NPC extends Object { // eslint-disable-line no-unused-vars

  /**
   * NPC constructor
   * @param {Map} Map - Map Manager
   * @param {object} Data
   */
  constructor(Map, Data) {
    super();
    console.log('NPC:constructor', Data);

    this.map = Map;

    this._loaded = false;

    this.position = null;
    this.sprite = null;

    this.speed = 150;

    this.moving = false;
    this.startPosition = null;
    this.targetPosition = null;

    this.name = Data.name;
    this.position = new Vector2(Data.x, Data.y);
    this._interactive = false;

    this._pathing = null;
    this._pathingIndex = 0;

    if (Data.properties.interactive) {
      this._interactive = Data.properties.interactive;
    }

    // Ugly
    if (Data.properties.pathing) {
      let path = Data.properties.pathing.split(',');
      this._pathing = path.reduce((paths, data) => {
        let path = data.split(':');

        paths.push(new Vector2(path[0], path[1]));

        return paths;
      }, []);
    }
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('NPC:_init');

    this.sprite = new Sprite(this.name);
    this.sprite.addAnimation('idle', {
      row: 0,
    });
    this.sprite.addAnimation('down', {
      frameCount: 3,
      row: 0,
      speed: 200,
    });
    this.sprite.addAnimation('left', {
      frameCount: 3,
      row: 1,
      speed: 200,
    });
    this.sprite.addAnimation('up', {
      frameCount: 3,
      row: 2,
      speed: 200,
    });
    this.sprite.addAnimation('right', {
      frameCount: 3,
      row: 3,
      speed: 200,
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

    let sprintMultiply = 1;

    // Path Finding???
    if (!this.moving && this._pathing) {
      this._pathingIndex++;
      if (this._pathingIndex > this._pathing.length - 1) {
        this._pathingIndex = 0;
      }

      let pathPoint = this._pathing[this._pathingIndex];
      this.targetPosition = this.map.getWorldPosition(pathPoint);

      if (this.targetPosition.x < this.position.x) {
        this.sprite.animate('left', sprintMultiply);
      }
      if (this.targetPosition.x > this.position.x) {
        this.sprite.animate('right', sprintMultiply);
      }
      if (this.targetPosition.y < this.position.y) {
        this.sprite.animate('up', sprintMultiply);
      }
      if (this.targetPosition.y > this.position.y) {
        this.sprite.animate('down', sprintMultiply);
      }

      this.moving = true;
    }

    if (this.moving) {
      let distance = new Vector2(
        Math.abs(this.position.x - this.targetPosition.x),
        Math.abs(this.position.y - this.targetPosition.y)
      );

      if (distance.x < this.speed * delta) {
        this.position = new Vector2(
          this.targetPosition.x,
          this.position.y
        );
      }
      if (distance.y < this.speed * delta) {
        this.position = new Vector2(
          this.position.x,
          this.targetPosition.y
        );
      }

      let vPos = new Vector2(0, 0);

      if (this.position.x > this.targetPosition.x) {
        vPos.x -= (this.speed * sprintMultiply) * delta;
      } else if (this.position.x < this.targetPosition.x) {
        vPos.x += (this.speed * sprintMultiply) * delta;
      } else if (this.position.y > this.targetPosition.y) {
        vPos.y -= (this.speed * sprintMultiply) * delta;
      } else if (this.position.y < this.targetPosition.y) {
        vPos.y += (this.speed * sprintMultiply) * delta;
      } else {
        this.moving = false;
      }

      this.position.add(vPos);
    }

    this.sprite.update(delta);
  }

  /**
   *
   * @param {object} context - Game canvas context
   * @param {Vector2} viewOffset - Viewport manager offset
   */
  render(context, viewOffset) {
    // console.log('NPC:render');
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
