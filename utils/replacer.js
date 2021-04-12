module.exports = function (key, value) {
	if (key == '__comment' || key == '__name') {
		return void 0;
	}

	return value;
}