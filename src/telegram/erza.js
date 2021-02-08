require('dotenv').config();

const { Telegraf } = require('telegraf');
const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter({ skipFirstLoad: true });
const feedUrls = require('./feeds.js');
//const fs = require('fs');
const bot = new Telegraf(process.env.TELEGRAM_TOKEN_ERZA);

function init() {
	console.log('Logged in as Erza!');

	feeder.add({
		url: feedUrls.urls,
		refresh: 60000,
	});
	feeder.on('new-item', function (item) {
		bot.telegram.sendMessage(process.env.TELEGRAM_CHANNEL_ID, item.link);
	});

	feeder.on('error', function (error) {
		console.log(error + error.url);
	});
}

function login() {
	bot.launch().then(() => init());
}

exports.login = login;
