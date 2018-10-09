"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RemoteFileSystemServer = void 0;

function _thrift() {
  const data = _interopRequireDefault(require("thrift"));

  _thrift = function () {
    return data;
  };

  return data;
}

function _ThriftFileSystemService() {
  const data = _interopRequireDefault(require("./gen-nodejs/ThriftFileSystemService"));

  _ThriftFileSystemService = function () {
    return data;
  };

  return data;
}

function _ThriftFileSystemServiceHandler() {
  const data = require("./ThriftFileSystemServiceHandler");

  _ThriftFileSystemServiceHandler = function () {
    return data;
  };

  return data;
}

function _ports() {
  const data = require("../../common/ports");

  _ports = function () {
    return data;
  };

  return data;
}

function _log4js() {
  const data = require("log4js");

  _log4js = function () {
    return data;
  };

  return data;
}

function _nuclideWatchmanHelpers() {
  const data = require("../../../../nuclide-watchman-helpers");

  _nuclideWatchmanHelpers = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @format
 */

/**
 * Wrapper class of raw thrift server which provide more methods
 * e.g. initialze(), close() etc.
 */
class RemoteFileSystemServer {
  constructor(port) {
    this._port = port;
    this._logger = (0, _log4js().getLogger)('fs-thrift-server');
    this._watcher = new (_nuclideWatchmanHelpers().WatchmanClient)();
    this._thriftFileSystemserviceHandler = new (_ThriftFileSystemServiceHandler().ThriftFileSystemServiceHandler)(this._watcher);
  }

  async initialize() {
    if (this._server != null) {
      return;
    }

    this._server = _thrift().default.createServer(_ThriftFileSystemService().default, this._thriftFileSystemserviceHandler);

    this._server.on('error', error => {
      throw error;
    });

    const isServerListening = await (0, _ports().scanPortsToListen)(this._server, String(this._port));

    if (!isServerListening) {
      throw new Error(`All ports in range "${this._port}" are already in use`);
    }
  }

  getPort() {
    return this._server.address().port;
  }

  close() {
    this._logger.info('Close remote file system thrift service server...');

    this._server = null;

    this._watcher.dispose();

    this._thriftFileSystemserviceHandler.dispose();
  }

}

exports.RemoteFileSystemServer = RemoteFileSystemServer;