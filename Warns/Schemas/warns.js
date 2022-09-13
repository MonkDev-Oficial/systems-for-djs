const { Schema, model } = require('mongoose');

module.exports = model('Warns',new Schema({
	GuildID: String,
	UserID: String,
	Id: String,
	ModeratorID: String,
	Reason: String,
	Date: Number
}));
