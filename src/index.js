// Function imports
const _server = require('./server.js');
const maiSan = require('./discord/maiSan.js');
const zeroTsu = require('./discord/zeroTsu.js');

_server.start();
maiSan.login();
zeroTsu.login();
