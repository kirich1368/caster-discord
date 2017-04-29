'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DiscordIncomingContext = undefined;

var _util = require('util');

var _constants = require('../util/constants');

var _caster = require('../../../caster');

/**
 * Incoming vk context
 *
 * @public
 */
class DiscordIncomingContext extends _caster.IncomingContext {
	/**
  * Constructor
  *
  * @param {DiscordPlatform} platform
  * @param {Caster}          caster
  * @param {Message}         message
  * @param {string}          type
  */
	constructor(platform, caster, message, type = 'incoming') {
		super(caster);

		this._platform = platform;
		this.platform = _constants.PLATFORM;
		this.type = type;

		this.from = {
			id: message.channel.id
		};

		this.text = message.content;

		this.raw = message;
	}

	/**
  * Sends a message to the current dialog
  *
  * @param {mixed}  text
  * @param {Object} options
  *
  * @return {Promise}
  */
	reply(text, options = {}) {
		if (typeof text === 'object') {
			options = text;
		} else {
			options.text = text;
		}

		return this._platform.send(options, this.raw);
	}

	/**
  * Hide private property to inspect
  *
  * @return {string}
  */
	inspect() {
		const out = {};

		for (const key of Object.keys(this)) {
			if (key.startsWith('_')) {
				continue;
			}

			out[key] = this[key];
		}

		delete out.caster;

		return this.constructor.name + ' ' + (0, _util.inspect)(out);
	}
}
exports.DiscordIncomingContext = DiscordIncomingContext;

/* TODO: Change from local package to npm */
