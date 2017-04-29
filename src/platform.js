'use strict';

import { Client as DiscordClient } from 'discord.js';

/* TODO: Change from local package to npm */
import { Platform } from '../../caster';

import createDebug from 'debug';

import { DiscordMessageContext } from './contexts/message';

import {
	PLATFORM,
	defaultOptions,
	defaultOptionsSchema
} from './util/constants';

const debug = createDebug('caster:platform-discord');

/**
 * Platform for integration with social network VK
 *
 * @public
 */
export class DiscordPlatform extends Platform {
	/**
	 * Constructor
	 *
	 * @param {Object} options
	 */
	constructor (options = {}) {
		super();

		Object.assign(this.options, defaultOptions);

		this.discord = new DiscordClient;

		this._casters = new WeakSet;

		if (Object.keys(options).length > 0) {
			this.setOptions(options);
		}
	}

	/**
	 * @inheritdoc
	 */
	setOptions (options) {
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
	getOptionsSchema () {
		return super.getOptionsSchema();
	}

	/**
	 * @inheritdoc
	 */
	async start () {
		await this.discord.login(this.options.adapter.token);
	}

	/**
	 * @inheritdoc
	 */
	async stop () {
		await this.discord.destroy();
	}

	/**
	 * @inheritdoc
	 */
	subscribe (caster) {
		if (this._casters.has(caster)) {
			return;
		}

		this._casters.add(caster);

		this.discord.on('message', (message) => {
			/* Ignore other bots and self */
			if (message.author.bot) {
				return;
			}

			caster.dispatchIncomingMiddleware(
				new DiscordMessageContext(this, caster, message)
			);
		});
	}

	/**
	 * @inheritdoc
	 */
	unsubscribe (caster) {
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
	 * @return {Promise<mixed>}
	 */
	send (params) {
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
