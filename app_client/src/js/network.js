'use strict';

/** Class Network */
class Network { // eslint-disable-line no-unused-vars

  /**
   *
   * @param {object} socketIO
   */
  constructor(socketIO) {
    console.log('Network:constructor');
    this.io = null;
    this.socket = null;

    this._loaded = false;
    this._connected = false;

    this.totalPlayers = 0;

    this._init(socketIO);
  }

  /**
   *
   * @param {object} socketIO
   * @private
   */
  _init(socketIO) {
    console.log('Network:_init');
    if (!socketIO) {
      return;
    }

    this.io = socketIO;
    this.socket = this.io.connect();

    this._listeners();
    this._loaded = true;
  }

  /**
   *
   * @return {boolean}
   */
  loaded() {
    return this._loaded;
  }

  /**
   *
   * @return {boolean}
   */
  connected() {
    return this._connected;
  }

  /**
   *
   * @private
   */
  _listeners() {
    console.log('Network:_listeners');
    this.socket.on('connect', () => {
      console.log('Network:onConnect', 'Connected');
      this._connected = true;
    });
    this.socket.on('disconnect', () => {
      console.log('Network:onDisconnect', 'Disconnect');
      this._connected = false;
    });

    this.socket.on('playerConnected', (count) => {
      this.totalPlayers = count;
    });
    this.socket.on('playerDisconnected', (count) => {
      this.totalPlayers = count;
    });
  }

}
