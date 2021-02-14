const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const getFiles = require('./utils/showFiles');

console.log('Build pack.mcmeta');
let packMcmeta;

try {
	packMcmeta = JSON.parse(fs.readFileSync('./pack/pack.mcmeta'));
} catch (err) {
	core.setFailed('Cannot read pack.mcmeta');
}

if (packMcmeta.pack.pack_version) {
	packMcmeta.pack.description = packMcmeta.pack.description.replace(/\%pack_version\%/g, packMcmeta.pack.pack_version);
	core.setOutput("packVersion", packMcmeta.pack.pack_version);
	console.log(`Pack version is ${packMcmeta.pack.pack_version}`)
	delete packMcmeta.pack.pack_version;
}

fs.writeFileSync('./pack/pack.mcmeta', JSON.stringify(packMcmeta));

core.setOutput("packDescription", packMcmeta.pack.description);
console.log('Minify json File');


const jsonFiles = getFiles('./pack/assets/', name => /^.+\.json$/.test(name));

for (const path of jsonFiles) {
	const json = JSON.parse(fs.readFileSync(path));
	if (path === 'pack/assets/minecraft/lang/ja_jp.json') continue;
	if (path.startsWith('pack/assets/minecraft/models/')) {
		if (json.credit) delete json.credit;
		if (json.groups) delete json.groups;
		if (json.elements) {
			for (let i = 0; i < json.elements.length;i++) {
				if (json.elements[i].name) delete json.elements[i].name
			}
		}
	}
	fs.writeFileSync(path, JSON.stringify(json));
}