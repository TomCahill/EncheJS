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
    this._mapLoading = false;

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
    this._mapLoading = true;
    return new Promise((resolve) => {
      let xhr = new XMLHttpRequest();
      xhr.open('get', `/data/${mapName}.json`, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            this._mapLoading = false;
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
    if (!this._mapData || this._mapLoading === true) {
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

}
