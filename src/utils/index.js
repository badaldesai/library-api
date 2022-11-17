const bunyan = require('bunyan');
const Joi = require('joi');
const { name } = require('../../package.json');

module.exports = {
	headerValidationSchema: Joi.object().keys({
		authorization: Joi.string().min(10).required(),
	}).unknown(true),

	log: bunyan.createLogger({
		level: process.env.LOGGING_LEVEL,
		name,
	}),
};
