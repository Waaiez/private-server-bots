require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const token_maiSan = process.env.DISCORD_TOKEN_MAISAN;

const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter({ skipFirstLoad: true });

const _channel = require('./functions/channel.js');

let animeEpisodesDetails, animeDiscussionDetails, botLogDetails;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

	animeEpisodesDetails = client.channels.cache.get(
		process.env.ANIME_EPISODE_CHANNEL_ID
	);
	animeDiscussionDetails = client.channels.cache.get(
		process.env.ANIME_DISCUSSION_CHANNEL_ID
	);
	botLogDetails = client.channels.cache.get(process.env.BOT_LOG_CHANNEL_ID);
});

client.on('message', async (msg) => {
	if (msg.channel.name == process.env.NEW_EPISODES_CHANNEL_NAME) {
		if (
			msg.author.id === process.env.ANIWATCH_NEW_RELEASES_BOT ||
			msg.author.id === process.env.ANIWATCH_NEW_UPLOADS_BOT
		) {
			_channel.aniwatchEpisode(msg, animeEpisodesDetails);
		}
	}
});

feeder.add({
	url: 'https://www.reddit.com/user/autolovepon.rss',
	refresh: 30000,
});

feeder.on('new-item', function (item) {
	_channel.episodeDiscussion(item, animeDiscussionDetails);
});

feeder.on('error', function (error) {
	_channel.botLog('Feed Error', error);
});

function login() {
	client.login(token_maiSan);
}

function botLogChannelDetails() {
	return botLogDetails;
}

exports.login = login;
exports.botLogChannelDetails = botLogChannelDetails;
