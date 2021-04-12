const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const getFiles = require('./showFiles');
const replacer = require('./replacer');
const replaceArgs = require('./replaceArgs');

class Builder {
	constructor (root) {
		this.root = root;
	}

	/**
	 * return JSON File Paths
	 * @param {String} p path
	 * @returns {Array<String>}
	 */
	getJSONFiles (p) {
		return getFiles(path.join(this.root, p), name => /^.+\.json$/.test(name)).map(name => path.relative('./pack', name));
	}

	/**
	 * return JSON File contains
	 * @param {String} p path
	 * @returns {Any}
	 */
	loadJSONFile (p) {
		return JSON.parse(fs.readFileSync(path.join(this.root, p), {
			encoding: 'utf8',
		}));
	}

	saveJSONFile (p, data, minify=true) {
		if (minify) {
			if (p.startsWith('assets/minecraft/models')) {
				if (data.credit) delete data.credit;
				if (data.groups) delete data.groups;
				if (data.elements) for (let i = 0; i < data.elements.length;i++) if (data.elements[i].name) delete data.elements[i].name;
			}
		}
		fs.writeFileSync(path.join(this.root, p), JSON.stringify(data, replacer, minify ? undefined : '\t'), {encoding: 'utf8'});
	}

	buildMeta () {
		const meta = this.loadJSONFile('pack.mcmeta');
		meta.pack.description = replaceArgs(meta.pack.description, {
			pack_version: meta.pack.pack_version
		});

		core.setOutput('packVersion', meta.pack.pack_version);
		core.setOutput("packDescription", meta.pack.description);

		delete meta.pack.pack_version;

		this.saveJSONFile('pack.mcmeta', meta);

		return meta;
	}

	minifyFiles (p) {
		const files = this.getJSONFiles(p);
		for (const file of files) this.minifyFile(file);
	}

	minifyFile (p) {
		try {
			this.saveJSONFile(p, this.loadJSONFile(p));
		} catch (e) {
			console.error(e);
		}
	}

	minify () {
		this.minifyFile('assets/minecraft/sounds.json');
		this.minifyFiles('assets/minecraft/font');
		this.minifyFiles('assets/minecraft/models');
	}
}

module.exports = Builder;