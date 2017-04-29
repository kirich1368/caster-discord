'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DiscordPlatform = undefined;

var _discord = require('discord.js');

var _caster = require('../../caster');

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _message = require('./contexts/message');

var _constants = require('./util/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* TODO: Change from local package to npm */
const debug = (0, _debug2.default)('caster:platform-discord');

/**
 * Platform for integration with social network VK
 *
 * @public
 */
class DiscordPlatform extends _caster.Platform {
	/**
  * Constructor
  *
  * @param {Object} options
  */
	constructor(options = {}) {
		super();

		Object.assign(this.options, _constants.defaultOptions);

		this.discord = new _discord.Client();

		this._casters = new WeakSet();

		if (Object.keys(options).length > 0) {
			this.setOptions(options);
		}
	}

	/**
  * @inheritdoc
  */
	setOptions(options) {
		super.setOptions(options);

		if ('adapter' in options) {
			const { adapter } = this.options;

			if ('token' in options) {
				this.discord.login(adapter.token);
			}
		}

		return this;
	}

	/**
  * @inheritdoc
  */
	getOptionsSchema() {
		return super.getOptionsSchema();
	}

	/**
  * @inheritdoc
  */
	async start() {
		await this.discord.login(this.options.adapter.token);
	}

	/**
  * @inheritdoc
  */
	async stop() {
		await this.discord.destroy();
	}

	/**
  * @inheritdoc
  */
	subscribe(caster) {
		if (this._casters.has(caster)) {
			return;
		}

		this._casters.add(caster);

		this.discord.on('message', message => {
			/* Ignore other bots and self */
			if (message.author.bot) {
				return;
			}

			caster.dispatchIncomingMiddleware(new _message.DiscordMessageContext(this, caster, message));
		});
	}

	/**
  * @inheritdoc
  */
	unsubscribe(caster) {
		if (!this._casters.has(caster)) {
			return;
		}

		this._casters.delete(caster);

		/* TODO: Add unsubscribe events longpoll */
	}

	/**
  * Sends a message
  *
  * @param {Object} params
  *
  * @return {Promise}
  */
	send(params) {
		if ('text' in params) {
			params.content = params.text;
			delete params.text;
		}

		const { content, channel_id: chanelId } = params;
		delete params.channel_id;
		delete params.content;

		return this.discord.channels.get(chanelId).sendMessage(content, params);
	}
}
exports.DiscordPlatform = DiscordPlatform;