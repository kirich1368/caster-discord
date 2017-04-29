'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultOptionsSchema = exports.defaultOptions = exports.PLATFORM = undefined;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Platform context name
 *
 * @type {string}
 */
const PLATFORM = exports.PLATFORM = 'discord';

/**
 * Default options platform
 *
 * @type {Object}
 */
const defaultOptions = exports.defaultOptions = {
  adapter: {}
};

/**
 * Default options platform schema
 *
 * @type {Object}
 *
 * @extends {defaultOptions}
 */
const defaultOptionsSchema = exports.defaultOptionsSchema = _joi2.default.object().keys({
  adapter: _joi2.default.object()
});