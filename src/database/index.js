const mongoose = require('mongoose');
const { log } = require('../utils');

module.exports = {
	initialize: async () => {
		// connect to Mongo
		await mongoose.connect(process.env.DATABASE_HOST);

		log.info('connected to Mongo at %s', process.env.DATABASE_HOST);
	},
};
