const Boom = require('@hapi/boom');
const _ = require('lodash');
const moment = require('moment');
const reservation = require('../database/models/reservation');
const user = require('../database/models/user');

const MAXIMUM_DAYS_TO_RESERVE = 15;

module.exports = {
	createReservation: async ({
		title, author, username, reserve_date,
	}, userId) => {
		const foundUser = await user.findOne({ username });
		if (_.isEmpty(foundUser)) {
			throw Boom.notFound('Username is not registered in our library.');
		}
		const reserveDateMoment = moment(reserve_date, 'DD/MM/YYYY');
		const existingReservation = await reservation.find({
			title,
			author,
			$and: [
				{ reserveDate: { $lte: reserveDateMoment.toDate() } },
				{ returnDate: { $gte: reserveDateMoment.toDate() } },
			],
		});
		if (!_.isEmpty(existingReservation)) {
			throw Boom.conflict('Book is already reserved for reserve date.');
		}
		const firstReservation = await reservation.findOne({
			title,
			author,
			reserveDate: { $gte: reserveDateMoment.toDate() },
		});
		let returnDateMoment = reserveDateMoment.clone().add(MAXIMUM_DAYS_TO_RESERVE, 'days');
		if (firstReservation) {
			const latestRequiredDate = moment(firstReservation.reserveDate);
			if (latestRequiredDate.isBefore(returnDateMoment)) {
				returnDateMoment = latestRequiredDate.subtract(1, 'day');
			}
		}

		return reservation.create({
			userId,
			title,
			author,
			username,
			reserveDate: reserveDateMoment.toDate(),
			returnDate: returnDateMoment.toDate(),
		});
	},

	getReservationByUser: async (userId) => {
		const foundUser = await user.findOne({ userId });
		const userReservations = await reservation.find({
			username: foundUser.username,
		});
		if (_.isEmpty(userReservations)) {
			throw Boom.notFound('There is no reservation for you.');
		}

		return userReservations;
	},

	getNextBookAvailability: async ({
		title, author,
	}) => {
		const existingReservations = await reservation.find({
			title,
			author,
			returnDate: { $gte: new Date() },
		}).sort({ reserveDate: 1 }).limit(100);
		const firstReservationDate = moment(existingReservations[0].reserveDate);
		if (_.isEmpty(existingReservations) || firstReservationDate.isAfter(moment().add(1, 'day'))) {
			let returnDateMoment = moment().add(MAXIMUM_DAYS_TO_RESERVE, 'days');
			if (firstReservationDate.isBefore(moment().add(MAXIMUM_DAYS_TO_RESERVE, 'days'))) {
				returnDateMoment = firstReservationDate;
			}
			return {
				availableDate: moment().format('DD/MM/YYYY'),
				returnDate: returnDateMoment.format('DD/MM/YYYY'),
			};
		}
		const lengthReservations = existingReservations.length;
		// eslint-disable-next-line no-plusplus
		for (let index = 0; index < lengthReservations - 1; index++) {
			const reserveDateMoment = moment(existingReservations[index + 1].reserveDate);
			const returnDateMoment = moment(existingReservations[index].returnDate);
			if (reserveDateMoment.diff(returnDateMoment, 'days') > 1) {
				let returnDateDay = returnDateMoment.add(MAXIMUM_DAYS_TO_RESERVE, 'days');
				if (reserveDateMoment.isBefore(returnDateDay)) {
					returnDateDay = reserveDateMoment;
				}
				return {
					availableDate: returnDateMoment.add(1, 'days').format('DD/MM/YYYY'),
					returnDate: returnDateDay.format('DD/MM/YYYY'),
				};
			}
		}
		if (lengthReservations.length !== 100) {
			const startDate = moment(existingReservations[lengthReservations - 1].returnDate);
			return {
				availableDate: startDate.format('DD/MM/YYYY'),
				returnDate: startDate.add(15, 'days').format('DD/MM/YYYY'),
			};
		}
		throw Boom.notFound('This book is not available for now.');
	},
};
