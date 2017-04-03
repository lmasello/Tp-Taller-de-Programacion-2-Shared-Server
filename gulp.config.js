'use strict';

module.exports = function () {
	const pkg = require('./package.json');

	const root = './';
	const server = './server/';
	const client = './client/';
	const views = `${server }views/`;
	const build = './build/';
	const appFolder = `${client}app/`;
	const assestFolder = `${client}assets/`;

	const config = {
		projectName: pkg.name,
		version: pkg.version,
		appFolder,
		app: `${appFolder}music-io.module.js`,
		root,
		build,
		server,
		views,
		images: `${assestFolder}images/`,
		fonts: `${assestFolder}fonts/`,
		vendorfolder: `${client}vendor/`,
		jsOrder: ['**/app.module.js', '**/*.module.js', '**/*.js'],
		files: {
			js: [`${client}**/*.js`, `!${client}**/*.templates.js`],
			html: `${client}**/*.html`,
			jade: `${client}**/*.jade`,
			json: `${client}**/*.json`
		}
	};

	return config;
};
