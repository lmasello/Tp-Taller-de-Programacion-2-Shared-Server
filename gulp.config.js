'use strict';

module.exports = function () {
	const pkg = require('./package.json');

	const root = './';
	const server = './server/';
	const client = './client/';
	const views = `${server}views/`;
	const scssfolder = `${client}app/`;
	const mainscss = `${scssfolder}music-io.scss`;
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
		mainscss,
		scssfolder,
		images: `${assestFolder}images/`,
		fonts: `${assestFolder}fonts/`,
		vendorfolder: `${client}vendor/`,
		jsOrder: ['**/app.module.js', '**/*.module.js', '**/*.js'],
		files: {
			js: `${client}**/*.js`,
			html: `${client}**/*.html`,
			jade: `${client}**/*.jade`,
			json: `${client}**/*.json`,
			sass: `${client}**/*.scss`
		}
	};

	return config;
};
