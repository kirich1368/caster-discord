'use strict';

import Joi from 'joi';

/**
 * Platform context name
 *
 * @type {string}
 */
export const PLATFORM = 'discord';

/**
 * Default options platform
 *
 * @type {Object}
 */
export const defaultOptions = {
	id: null,

	adapter: {}
};

/**
 * Default options platform schema
 *
 * @type {Object}
 *
 * @extends {defaultOptions}
 */
export const defaultOptionsSchema = Joi.object().keys({
	id: Joi.string().allow(null),

	adapter: Joi.object()
});
