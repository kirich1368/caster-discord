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

		this._casters = new Set;

		if (Object.keys(options).length > 0) {
			this.setOptions(options);
		}

		this._addDefaultEvents();
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
		return defaultOptionsSchema;
	}

	/**
	 * @inheritdoc
	 */
	async start () {
		await this.discord.login(this.options.adapter.token);

		if (this.options.id === null) {
			this.setOptions({
				id: this.discord.user.id
			});
		}
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
		this._casters.add(caster);
	}

	/**
	 * @inheritdoc
	 */
	unsubscribe (caster) {
		this._casters.delete(caster);
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

		const { content, _from: { id } } = params;
		delete params.content;
		delete params._from;

		return this.discord.channels.get(id).sendMessage(content, params);
	}

	/**
	 * Add default events discord
	 */
	_addDefaultEvents () {
		this.discord.on('message', (message) => {
			/* Ignore other bots and self */
			if (message.author.bot) {
				return;
			}

			for (const caster of this._casters) {
				caster.dispatchIncomingMiddleware(
					new DiscordMessageContext(this, caster, message)
				);
			}
		});
	}
}
