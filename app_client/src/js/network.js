'use strict';

/**
 *
 */
class Network {

  /**
   *
   */
  constructor() {
    console.log('Network:constructor');
    this.socket = null;

    this._init();
  }

  /**
   *
   * @private
   */
  _init() {
    console.log('Network:_init');
    this.socket = io.connect();

    this._listeners();
  }

  /**
   *
   * @private
   */
  _listeners() {
    console.log('Network:_listeners');
    this.socket.on('connect', function() {
      console.log('Network:onConnect', 'Connected');
    });
    this.socket.on('disconnect', function() {
      console.log('Network:onDisconnect', 'Disconnect');
    });
  }

}
