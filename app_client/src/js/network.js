'use strict';

/** Class Network */
class Network { // eslint-disable-line no-unused-vars

  /**
   *
   */
  constructor() {
    console.log('Network:constructor');
    this.socket = null;

    this.totalPlayers = null;

    this._init();
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('Network:_init');
    this.socket = io.connect();

    this.totalPlayers = 0;

    this._listeners();
  }

  /**
   *
   * @private
   */
  _listeners() {
    console.log('Network:_listeners');
    this.socket.on('connect', () => {
      console.log('Network:onConnect', 'Connected');
    });
    this.socket.on('disconnect', () => {
      console.log('Network:onDisconnect', 'Disconnect');
    });

    this.socket.on('playerConnected', (count) => {
      this.totalPlayers = count;
    });
    this.socket.on('playerDisconnected', (count) => {
      this.totalPlayers = count;
    });
  }

}
