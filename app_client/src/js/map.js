'use strict';

/** Class Map */
class Map {

  /**
   * Map constructor
   * @param {object} input - Game Input Manager
   */
  constructor(input, viewPortOffset) {
    console.log('Map:constructor');

    this.input = input;

    this._mapData = null;
    this._mapTileSet = null;
    this._mapLoaded = false;

    this.tileSize = 0;
    this.size = new Vector2(0, 0);

    this._init();
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('Map:_init');
    this.load('test')
      .then((data) => {
        this._mapData = data;
        this._mapTileSet = document.createElement('img');
        this._mapTileSet.setAttribute('src', this._mapData.tilesets[0].image);

        this.tileSize = this._mapData.tilewidth;
        this.size = new Vector2(this._mapData.width, this._mapData.height);
      })
      .catch((err) => console.error(err));
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

  loaded(){
    return this._mapLoaded;
  }

  /**
   * Takes a tile grid XY and returns a world XY
   * @param x
   * @param y
   * @return {object} - Vector2(x, y)
   */
  getWorldPosition(x, y) {
    return new Vector2(
      x * this.tileSize,
      y * this.tileSize
    );
  }

  getGridPosition(worldPosition) {
    return new Vector2(
      worldPosition.x / this.tileSize,
      worldPosition.y / this.tileSize
    );
  }

  /**
   *
   * @param {float} delta - Game Update delta time
   */
  update(delta) {
    // console.log('Map:update');
    // if (this.input.UP) {
    //   this._viewOffset.y -= this._viewSpeed * delta;
    // }
    // if (this.input.DOWN) {
    //   this._viewOffset.y += this._viewSpeed * delta;
    // }
    // if (this.input.LEFT) {
    //   this._viewOffset.x -= this._viewSpeed * delta;
    // }
    // if (this.input.RIGHT) {
    //   this._viewOffset.x += this._viewSpeed * delta;
    // }
  }

  /**
   *
   * @param {object} context - Game canvas context
   */
  render(context, viewOffset) {
    if (!this._mapData || !this._mapLoaded) {
      return;
    }

    if (!this._mapData.layers || this._mapData.length < 0) {
      return;
    }

    for (let i = 0; i < this._mapData.layers.length; i++) {
      if (this._mapData.layers[i].type !== 'tilelayer') {
        return;
      }
      this._renderLayer(this._mapData.layers[i], context, viewOffset);
    }

    this._renderGridOverlay(context, viewOffset);
  }

  /**
   *
   * @param {object} layer
   * @param {object} context
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

      context.drawImage(this._mapTileSet, src.x, src.y, tileSize, tileSize, img.x, img.y, tileSize, tileSize);
    }
  }

  _renderGridOverlay(context, viewOffset) {
    for(let x = 0; x < this.size.x; x++) {
      for(let y = 0; y < this.size.y; y++) {
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
