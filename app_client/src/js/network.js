'use strict';

/** Class Network */
class Network { // eslint-disable-line no-unused-vars

  /**
   *
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
   * @private
   */
  _init(socketIO) {
    console.log('Network:_init');
    if (!socketIO){
      return;
    }

    this.io = socketIO;
    this.socket = this.io.connect();

    this._listeners();
    this._loaded = true;
  }

  loaded() {
    return this._loaded;
  }

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
