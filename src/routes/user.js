const Boom = require('@hapi/boom');
const express = require('express');
const user = require('../modules/user');
const { log } = require('../utils');
const { createUserValidation, loginUserValidation } = require('../utils/validation');

const STATUS_CODE_SUCCESS = 200;

module.exports = function (app) {
	const router = express.Router();

	app.use('/user', router);

	router.post('/register', async (req, res, next) => {
		try {
			const { value, error } = createUserValidation.validate(req.body);
			if (error) {
				log.error(`Argument validation failed with error: ${error}`);
				throw Boom.badRequest(`Request validation Failed: ${error}`);
			}
			const document = await user.register(value);
			return res.status(STATUS_CODE_SUCCESS).send(document);
		} catch (err) {
			return next(err);
		}
	});

	router.post('/login', async (req, res, next) => {
		try {
			const { value, error } = loginUserValidation.validate(req.body);
			if (error) {
				log.error(`Argument validation failed with error: ${error}`);
				throw Boom.badRequest(`Request validation Failed: ${error}`);
			}
			const document = await user.login(value);
			return res.status(STATUS_CODE_SUCCESS).send(document);
		} catch (err) {
			return next(err);
		}
	});
};
