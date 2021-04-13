const showFiles = require('./showFiles');
const path = require('path');
const fs = require('fs');

const files = showFiles('./pack/assets/minecraft/models', n => /^.+\.json$/)// .map(n => path.relative('./pack/assets/minecraft/models', n));
const parsedFile = files.map(f => {
	const m = [];
	const loaded = JSON.parse(fs.readFileSync(f, {encoding: 'utf8'}));
	const p = path.relative('./pack/assets/minecraft/models', f).replace(/\.json$/, '');
	m.push(`<span id="${p}">${loaded.__name ? loaded.__name : p}</span>`);
	m.push(p);
	m.push(loaded.parent ? `[${loaded.parent}](#${loaded.parent})` : '');
	m.push(loaded.elements ? loaded.elements.length : 0);
	m.push(loaded.overrides ? loaded.overrides.map(override => `[${override.model}](#${override.model})`).join('<br>') : "");
	m.push(loaded.__comment ? loaded.__comment : "");
	return m;
});

fs.writeFileSync('./models.csv', parsedFile.map(m=>m.join(',')).join('\n'));