const uuid = require('node-uuid');

module.exports = () => {
	return uuid.v1().replace(/\-/g,'')
}