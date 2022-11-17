const Boom = require('@hapi/boom');
const express = require('express');

const reserve = require('../modules/reserve');
const validation = require('../utils/validation');
const { log } = require('../utils');

module.exports = function (app) {
	const router = express.Router();

	app.use('/reserve', router);

	router.post('/', async (req, res, next) => {
		try {
			const { value, error } = validation.createReservationValidation.validate(req.body);
			if (error) {
				log.error(`Argument validation failed with error: ${error}`);
				throw Boom.badRequest(`Request validation Failed: ${error}`);
			}
			const reservation = await reserve.createReservation(value, req.userId);
			return res.status(201).send(reservation);
		} catch (err) {
			return next(err);
		}
	});

	router.get('/', async (req, res, next) => {
		try {
			const { userId } = req;
			const reservation = await reserve.getReservationByUser(userId);
			return res.status(200).send(reservation);
		} catch (err) {
			return next(err);
		}
	});

	router.post('/available', async (req, res, next) => {
		try {
			const { value, error } = validation.checkBookValidation.validate(req.body);
			if (error) {
				log.error(`Argument validation failed with error: ${error}`);
				throw Boom.badRequest(`Request validation Failed: ${error}`);
			}
			const reservation = await reserve.getNextBookAvailability(value);
			return res.status(200).send(reservation);
		} catch (err) {
			return next(err);
		}
	});
};
