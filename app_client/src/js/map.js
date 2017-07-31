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

    this._canvasBuffer = null;
    this._canvasBufferContext = null;

    this._mapData = null;
    this._mapLayers = null;
    this._mapTileSet = null;
    this._mapLoaded = false;
    this._postRenderLayer = null;

    this.tileSize = 0;
    this.size = new Vector2(0, 0);

    this._worldCollision = [];
    this._entityCollision = [];
    this._teleports = [];

    this._npc = [];

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
    return new Promise((resolve) => {
      let xhr = new XMLHttpRequest();
      xhr.open('get', `/data/${mapName}.json`, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
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

  /**
   *
   * @param {string} mapName - Name of the map to load
   * @return {Promise}
   */
  changeMap(mapName) {
    this._mapLoaded = false;
    return this.load(mapName)
      .then(this._parseMap.bind(this))
      .then(this._saveCanvas.bind(this))
      .then(() => {
        this._mapLoaded = true;
      })
      .catch((err) => console.error(err));
  }

  /**
   *
   * @param {object} data - Loaded json map data
   * @return {array} - Parsed map layers
   * @private
   */
  _parseMap(data) {
    this._mapData = data;
    this._mapTileSet = new Image();
    this._mapTileSet.src = this._mapData.tilesets[0].image;

    this.tileSize = this._mapData.tilewidth;
    this.size = new Vector2(this._mapData.width, this._mapData.height);

    // Parse out object layers
    return data.layers.reduce((layers, layer) => {
      if (layer.type === 'objectgroup' && layer.name === 'Teleports') {
        this._teleports = layer;
        return layers;
      }
      if (layer.type === 'objectgroup' && layer.name === 'NPC') {
        this._initNPCs(layer.objects);
        return layers;
      }
      if (layer.properties && layer.properties.worldCollision) {
        this._worldCollision = layer.data;
        return layers;
      }
      if (layer.properties && layer.properties.postRender) {
        this._postRenderLayer = layer;
        return layers;
      }

      layers.push(layer);
      return layers;
    }, []);
  }

  /**
   * Create a canvas to pre-render the map
   * @param {data} renderLayers - data to be rendered
   * @private
   */
  _saveCanvas(renderLayers) {
    this._canvasBuffer = document.createElement('canvas');
    this._canvasBuffer.width = this.size.x * this.tileSize;
    this._canvasBuffer.height = this.size.y * this.tileSize;

    let context = this._canvasBuffer.getContext('2d');

    const offset = new Vector2(0, 0);

    for (let i = 0; i < renderLayers.length; i++) {
      this._renderLayer(renderLayers[i], context, offset);
    }
  }

  /**
   *
   * @param {data} entitiesData - npc data to initialised
   * @private
   */
  _initNPCs(entitiesData) {
    console.log('Map:_initNPCs', entitiesData);
    this._npc = entitiesData.reduce((entities, data) => {
      entities.push(new NPC(this, data));
      return entities;
    }, []);
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

  /**
   * Check if current grid position is a teleport
   * @param {Vector2} gridPosition - grid postion
   * @return {Boolean}
   */
  getTeleport(gridPosition) {
    if (!this._teleports) {
      return false;
    }

    for (let i = 0; i < this._teleports.objects.length; i++) {
      let entity = this._teleports.objects[i];
      if (entity.type !== 'teleport') {
        continue;
      }

      const pos = this.getGridPosition(new Vector2(entity.x, entity.y));
      if (!gridPosition.equals(pos)) {
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

    if (this._entityCollision.indexOf(scalar) !== -1) {
      return false;
    }

    return this._worldCollision[scalar] === 0;
  }

  /**
   *
   * @param {float} delta - Game Update delta time
   */
  update(delta) {
    // console.log('Map:update');

    let entityCollision = [];

    this._npc.forEach((npc) => {
      npc.update(delta);

      if (npc.targetPosition || npc.position) {
        const pos = this.getGridPosition(npc.targetPosition || npc.position);
        entityCollision.push(pos.y * this.size.x + pos.x);
      }
    });

    this._entityCollision = entityCollision;
  }

  /**
   *
   * @param {object} context - Game canvas context
   * @param {Vector2} viewOffset - Viewport manager offset
   */
  render(context, viewOffset) {
    if (!this._mapLoaded) {
      return;
    }

    context.drawImage(this._canvasBuffer, -viewOffset.x, -viewOffset.y);

    for (let i = 0; i < this._npc.length; i++) {
      this._npc[i].render(context, viewOffset);
    }
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
   * @param {Vector2} viewOffset - View offset vector
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
}
