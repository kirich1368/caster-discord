'use strict';

const { VKPlatform } = require('./index');

const platform = new VKPlatform;

platform.setOptions({
	test: 123
});

console.log(platform.options);
