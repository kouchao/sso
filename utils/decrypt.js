const crypto = require('crypto');

module.exports = (ivv, code) => {
	return crypto.createHash('md5').update(ivv).digest('hex') == code;
}