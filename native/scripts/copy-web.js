// The web app is the app: copy the repo's single-file index.html into webDir.
const fs = require('fs');
const path = require('path');
const www = path.join(__dirname, '..', 'www');
fs.mkdirSync(www, { recursive: true });
fs.copyFileSync(path.join(__dirname, '..', '..', 'index.html'), path.join(www, 'index.html'));
console.log('copied index.html -> native/www/');
