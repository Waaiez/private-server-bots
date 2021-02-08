require('dotenv').config();

const _message = require('./message.js');
const maiSan = require('../maiSan.js');
const _anilist = require('./anilist.js');

async function aniwatchEpisode(messageDetails, channelDetails) {
	let episodeLanguage = await _message.listLanguage(messageDetails);

	if (episodeLanguage == 'EngSub') {
		let animeName, animeEpisode;

		animeName = messageDetails.embeds[0].author.name;
		animeEpisode = messageDetails.embeds[0].title;

		channelDetails
			.send(animeName + ' - ' + animeEpisode)
			.catch((err) =>
				botLog('Channel_Episode - Send EngSub', 'Error: ' + err)
			);

		channelDetails.messages
			.fetch(messageDetails.id)
			.then((message) => message.delete())
			.catch((error) => {
				if (error.code == 10008) {
					console.log('Message already deleted');
				} else {
					botLog(
						'Channel_Episode - Delete Aniwatch',
						'Error: ' + error
					);
				}
			});
	} else {
		channelDetails.messages
			.fetch(messageDetails.id)
			.then((message) => message.delete())
			.catch((error) => {
				if (error.code == 10008) {
					console.log('Message already deleted');
				} else {
					botLog(
						'Channel_Episode - Delete NonSub',
						'Error: ' + error
					);
				}
			});
	}

	findMissedAniwatchEpisode(channelDetails);
}

function findMissedAniwatchEpisode(channelDetails) {
	channelDetails.messages
		.fetch({
			limit: 100,
		})
		.then((message) => {
			const aniwatchMessage = message.filter(
				(msg) =>
					msg.author.id == process.env.ANIWATCH_NEW_RELEASES_BOT ||
					msg.author.id == process.env.ANIWATCH_NEW_UPLOADS_BOT
			);

			aniwatchMessage.forEach((msg) => {
				let messageTime = new Date(msg.createdTimestamp);
				let currentTime = new Date();

				let fiveMins = 5 * 60 * 1000;

				if (currentTime - messageTime > fiveMins) {
					aniwatchEpisode(msg, channelDetails);
				}
			});
		})
		.catch((err) => botLog('Channel_FindMissedEpisode', 'Error: ' + err));
}

function episodeDiscussion(feedItem, channelDetails) {
	channelDetails
		.send({
			embed: {
				title: feedItem.title,
				url: feedItem.link,
				color: 3444735,
				timestamp: feedItem.date,
			},
		})
		.catch((err) => botLog('Channel_Discussion - Send', 'Error: ' + err));
}

const myEpisode = async (message, channelDetails) => {
	let animeName = message.content.split(' - ')[0];

	let watchlist = await _anilist.currentWatching();

	for (let i = 0; i < watchlist.length; i++) {
		if (animeName == watchlist[i].media.title.romaji) {
			channelDetails
				.send(message.content)
				.catch((err) =>
					botLog('Channel_MyEpisode - Send Episode', err)
				);
		}
	}
};

const myDiscussion = async (message, channelDetails) => {
	let animeName = message.embeds[0].title.split(' - ')[0];

	let watchlist = await _anilist.currentWatching();

	for (let i = 0; i < watchlist.length; i++) {
		if (animeName.includes(watchlist[i].media.title.romaji)) {
			channelDetails
				.send({
					embed: {
						title: message.embeds[0].title,
						url: message.embeds[0].url,
						color: 3444735,
						timestamp: message.embeds[0].timestamp,
					},
				})
				.catch((err) =>
					botLog('Channel_MyDiscussion - Send Discussion', err)
				);
		}
	}
};

const botLog = async (errorLocation, error) => {
	let details = await maiSan.botLogChannelDetails();
	details.send(errorLocation + ': ' + error);
};

exports.aniwatchEpisode = aniwatchEpisode;
exports.episodeDiscussion = episodeDiscussion;
exports.myEpisode = myEpisode;
exports.myDiscussion = myDiscussion;
