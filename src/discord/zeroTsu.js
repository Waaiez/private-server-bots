require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const token_zeroTsu = process.env.DISCORD_TOKEN_ZEROTSU;

const _channel = require('./functions/channel.js');

let myAnimeEpisodesDetails, myAnimeDiscussionDetails;

function init() {
	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);

		myAnimeEpisodesDetails = client.channels.cache.get(
			process.env.MY_ANIME_EPISODE_CHANNEL_ID
		);
		myAnimeDiscussionDetails = client.channels.cache.get(
			process.env.MY_DISCUSSION_CHANNEL_ID
		);
	});

	client.on('message', async (msg) => {
		if (msg.channel.name == process.env.NEW_DISCUSSION_CHANNEL_NAME) {
			if (msg.author.id === process.env.BOT1_ID) {
				_channel.myDiscussion(msg, myAnimeDiscussionDetails);
			}
		}

		if (msg.channel.name == process.env.NEW_EPISODES_CHANNEL_NAME) {
			if (msg.author.id === process.env.BOT1_ID) {
				_channel.myEpisode(msg, myAnimeEpisodesDetails);
			}
		}
	});
}

function login() {
	client.login(token_zeroTsu).then(() => init());
}

exports.login = login;
