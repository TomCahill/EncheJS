'use strict';

/** Class Map */
class Map { // eslint-disable-line no-unused-vars

  /**
   * Map constructor
   * @param {Input} input - Game Input Manager
   */
  constructor(input) {
    console.log('Map:constructor');

    this.input = input;

    this._mapData = null;
    this._mapTileSet = null;
    this._mapLoaded = false;
    this._postRenderLayer = null;

    this.tileSize = 0;
    this.size = new Vector2(0, 0);

    this._worldCollision = [];
    this._teleports = [];

    this._init();
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('Map:_init');
    this.changeMap('home');
  }

  /**
   *
   * @param {string} mapName - Filename of map data
   * @return {Promise}
   */
  load(mapName) {
    console.log('Map:load', mapName);
    this._mapLoaded = false;
    return new Promise((resolve) => {
      let xhr = new XMLHttpRequest();
      xhr.open('get', `/data/${mapName}.json`, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            this._mapLoaded = true;
            resolve(JSON.parse(xhr.responseText));
          } else {
            throw new Error(xhr);
          }
        }
      };
      xhr.send();
    });
  }

  /**
   *
   * @return {boolean}
   */
  loaded() {
    return this._mapLoaded;
  }

  changeMap (mapName){
    this.load(mapName)
      .then((data) => {
        this._mapData = data;
        this._mapTileSet = new Image();
        this._mapTileSet.src = this._mapData.tilesets[0].image;

        this.tileSize = this._mapData.tilewidth;
        this.size = new Vector2(this._mapData.width, this._mapData.height);
      })
      .catch((err) => console.error(err));
  }

  /**
   * Takes a tile grid XY and returns a world XY
   * @param {Vector2} gridPosition
   * @return {Vector2}
   */
  getWorldPosition(gridPosition) {
    return new Vector2(
      gridPosition.x * this.tileSize,
      gridPosition.y * this.tileSize
    );
  }

  /**
   *
   * @param  {Vector2} worldPosition
   * @return {Vector2}
   */
  getGridPosition(worldPosition) {
    return new Vector2(
      worldPosition.x / this.tileSize,
      worldPosition.y / this.tileSize
    );
  }

  getTeleport(gridPosition) {
    if (!this._teleports) {
      return false;
    }

    for (let i = 0; i < this._teleports.objects.length; i++) {
      let entity = this._teleports.objects[i];
      if (entity.type !== 'teleport') {
        continue;
      }

      if (!gridPosition.equals(this.getGridPosition(new Vector2(entity.x, entity.y)))) {
        continue;
      }

      return entity;
    }

    return false;
  }

  /**
   *
   * @param {Vector2} gridPosition
   * @return {Boolean}
   */
  isTileTraversable(gridPosition) {
    let scalar = gridPosition.y * this.size.x + gridPosition.x;
    return this._worldCollision[scalar] === 0;
  }

  /**
   *
   * @param {float} delta - Game Update delta time
   */
  update(delta) {
    // console.log('Map:update');
  }

  /**
   *
   * @param {object} context - Game canvas context
   * @param {Vector2} viewOffset - Viewport manager offset
   */
  render(context, viewOffset) {
    if (!this._mapData || !this._mapLoaded) {
      return;
    }

    if (!this._mapData.layers || this._mapData.length < 0) {
      return;
    }

    for (let i = 0; i < this._mapData.layers.length; i++) {
      let layer = this._mapData.layers[i];

      if (layer.type === 'objectgroup' && layer.name === "Teleports") {
        this._teleports = layer;
        continue;
      }

      if (layer.type !== 'tilelayer') {
        continue;
      }
      if (layer.properties && layer.properties.worldCollision) {
        this._worldCollision = layer.data;
        continue;
      }
      if (layer.properties && layer.properties.postRender) {
        this._postRenderLayer = layer;
        continue;
      }

      this._renderLayer(this._mapData.layers[i], context, viewOffset);
    }

    // this._renderGridOverlay(context, viewOffset);
  }

  /**
   *
   * @param {object} context - Game canvas context
   * @param {Vector2} viewOffset - Viewport manager offset
   */
  postRender(context, viewOffset) {
    if (!this._postRenderLayer) {
      return;
    }

    this._renderLayer(this._postRenderLayer, context, viewOffset);
  }

  /**
   *
   * @param {object} layer - Map Layer data
   * @param {object} context - Game canvas context
   * @param {Vector2} viewOffset - Viewport manager offset
   * @private
   */
  _renderLayer(layer, context, viewOffset) {
    let tileSize = this._mapData.tilewidth;
    let tile = this._mapData.tilesets[0];
    for (let i=0; i < layer.data.length; i++) {
      if (layer.data[i]<1) {
        continue;
      }

      let img = new Vector2(0, 0);
      let src = new Vector2(0, 0);

      img.x = (i % ((this._mapData.width*tileSize) / tileSize)) * tileSize;
      img.y = ~~(i / ((this._mapData.width*tileSize) / tileSize)) * tileSize;
      src.x = ((layer.data[i]-1) % (tile.imagewidth/tileSize)) * tileSize;
      src.y = ~~((layer.data[i]-1) / (tile.imagewidth/tileSize)) * tileSize;

      img.x -= viewOffset.x;
      img.y -= viewOffset.y;

      context.drawImage(
        this._mapTileSet, // Image
        src.x, // dX
        src.y, // dY
        tileSize, // dWidth
        tileSize, // dHeight
        img.x, // sX
        img.y, // sY
        tileSize, // sWidth
        tileSize // sHeight
      );
    }
  }

  /**
   *
   * @param {object} context - Game canvas context
   * @param {Vector2} viewOffset - Viewport manager offset
   * @private
   */
  _renderGridOverlay(context, viewOffset) {
    console.log(context);
    for (let x = 0; x < this.size.x; x++) {
      for (let y = 0; y < this.size.y; y++) {
        context.fillStyle = 'rgba(255, 0, 0, 0.5)';
        context.strokeRect(
          x * this.tileSize - viewOffset.x,
          y * this.tileSize - viewOffset.y,
          this.tileSize,
          this.tileSize
        );
        context.font = '20px Arial';
        context.fillStyle = '#FFFFFF';
        context.fillText(
          `${x},${y}`,
          x * this.tileSize - viewOffset.x + 10,
          y * this.tileSize - viewOffset.y - 20
        );
      }
    }
  }
}
