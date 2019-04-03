const mongoose = require('./config');
const Ver = mongoose.model('ver', {
	start_time: {
		type: String,
		required: true
	},
	end_time: {
		type: String,
		required: true
	},
	code: {
		type: String,
		required: true
	},
	auth: {
		type: String,
		unique: true
	},
	uid: {
		type: String,
		unique: true
	},
	invalid: {
		type: Boolean,
	}

});

module.exports = Ver