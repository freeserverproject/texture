const fs = require('fs');
const path = require('path');

const showFiles = (dirpath, filter, a=[]) => {
	const dirents = fs.readdirSync(dirpath, {withFileTypes: true});
	for (const dirent of dirents) {
		const fp = path.join(dirpath, dirent.name);
		if (dirent.isDirectory()) {
			a = showFiles(fp, filter, a);
		} else {
			if (filter(dirent.name)) a.push(fp);
		}
	}
	return a;
}

module.exports = showFiles;