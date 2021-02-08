function listLanguage(message) {
	let messageContent;
	messageContent =
		message.embeds[0].author.name + ' ' + message.embeds[0].title;

	if (new RegExp('EngSub').test(messageContent)) {
		return 'EngSub';
	} else {
		return 'NonSub';
	}
}

exports.listLanguage = listLanguage;
