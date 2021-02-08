const express = require('express');
const app = express();

app.get('/', (request, response) => {
	console.log('Ping received!');
	response.sendStatus(200);
});

function start() {
	let server = app.listen(0, () => {
		console.log('Listening on localhost:' + server.address().port);
	});
}

exports.start = start;
