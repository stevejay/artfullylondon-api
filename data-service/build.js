const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('./content.json', 'utf8'));
fs.writeFileSync('./build/content.txt', JSON.stringify(obj));
