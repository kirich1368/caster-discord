'use strict';

import { inspect } from 'util';

import { PLATFORM } from '../util/constants';

/* TODO: Change from local package to npm */
import { MessageContext } from '../../../caster';

const enumTypesMessage = {
	text: 'channel',
	dm: 'dialog'
};

/**
 * Incoming vk context
 *
 * @public
 */
export class DiscordMessageContext extends MessageContext {
	/**
	 * Constructor
	 *
	 * @param {DiscordPlatform} platform
	 * @param {Caster}          caster
	 * @param {Message}         message
	 * @param {string}          type
	 */
	constructor (platform, caster, message) {
		super(caster);

		this.platform = PLATFORM;

		const { type } = message.channel;

		this.from = {
			id: message.channel.id,
			type: (type in enumTypesMessage)
				? enumTypesMessage[type]
				: type
		};

		this.sender = {
			id: message.author.id,
			type: 'user'
		};

		this.text = message.content;

		this.raw = message;

		this._platform = platform;
	}

	/**
	 * Sends a message to the current dialog
	 *
	 * @param {mixed}  text
	 * @param {Object} options
	 *
	 * @return {Promise<mixed>}
	 */
	send (text, options = {}) {
		if (typeof text === 'object') {
			options = text;
		} else {
			options.text = text;
		}

		options.channel_id = this.from.id;

		return this._platform.send(options);
	}

	/**
	 * Responds to a message with a mention
	 *
	 * @param {mixed}  text
	 * @param {Object} options
	 *
	 * @return {Promise<mixed>}
	 */
	reply (text, options = {}) {
		if (typeof text === 'object') {
			options = text;
		} else {
			options.text = text;
		}

		options.text = `<@${this.sender.id}>, ${options.text}`;

		return this.send(options);
	}

	/**
	 * Hide private property to inspect
	 *
	 * @return {string}
	 */
	inspect () {
		const out = {};

		for (const key of Object.keys(this)) {
			if (key.startsWith('_')) {
				continue;
			}

			out[key] = this[key];
		}

		delete out.caster;

		return this.constructor.name + ' ' + inspect(out);
	}
}
