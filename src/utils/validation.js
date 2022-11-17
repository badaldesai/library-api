const JoiImport = require('joi');
const JoiDate = require('@hapi/joi-date');

const Joi = JoiImport.extend(JoiDate);

const createUserValidation = Joi.object({
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	username: Joi.string().alphanum().min(6).required(),
	password: Joi.string().alphanum().min(6).required(),
});

const loginUserValidation = Joi.object({
	username: Joi.string().alphanum().min(6).required(),
	password: Joi.string().alphanum().min(6).required(),
});

const createReservationValidation = Joi.object({
	title: Joi.string().required(),
	author: Joi.string().required(),
	username: Joi.string().required(),
	reserve_date: Joi.date()
		.format('DD/MM/YYYY').greater('now')
		.required(),
});

const checkBookValidation = Joi.object({
	title: Joi.string().required(),
	author: Joi.string().required(),
});

module.exports = {
	createUserValidation,
	loginUserValidation,
	createReservationValidation,
	checkBookValidation,
};
