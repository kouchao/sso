const mongoose = require('./config');
const User = mongoose.model('user', {
	username: {
		type: String,
		required: true,
		unique: true
	},
	mobile: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	token: {
		type: String,
	},
	expiry_time: {
		type: Date
	}

});

module.exports = User