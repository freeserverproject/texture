const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

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
	delete packMcmeta.pack.pack_version;
}

fs.writeFileSync('./pack/pack.mcmeta', JSON.stringify(packMcmeta));