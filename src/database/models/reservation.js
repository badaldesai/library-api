const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
	userId: { type: String, default: null },
	username: { type: String, default: null },
	author: { type: String, default: null },
	title: { type: String },
	reserveDate: { type: Date },
	returnDate: { type: Date },
});

module.exports = mongoose.model('reservation', reservationSchema);
