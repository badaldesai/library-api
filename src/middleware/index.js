const express = require('express');
const cors = require('cors');

const { log } = require('../utils');
const authentication = require('./authentication');

/**
 * This module contains express middleware.
 * Middleware authenicate any request comes to API.
 * Error Handlers middleware will intercept responses and send proper error codes to the client.
 */
module.exports = {

	registerErrorHandlers: (app) => {
		// eslint-disable-next-line no-unused-vars
		app.use((req, res, next) => {
			log.warn('404: %s %s', req.method, req.url);
			return res.status(404).json({ error: 'resource not found' });
		});

		// unhandled exceptions
		// eslint-disable-next-line no-unused-vars
		app.use((err, req, res, next) => {
			if (err.isBoom) {
				err.status = err.output.statusCode;
				err.body = err.output.payload;
			}
			if (err.status) {
				if (err.status >= 400 && err.status < 500) {
					log.warn('%s: %s %s', err.status, req.method, req.url);
				} else {
					log.error('%s: %s %s', err.status, req.method, req.url);
				}
			}
			log.error(err);
			return res.status(err.status || 500).json(err);
		});
	},

	registerMiddleware: (app) => {
		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());
		app.use(cors());

		// request logging
		app.use((req, res, next) => {
			log.trace('%s %s', req.method, req.url);
			return next();
		});

		app.use(authentication.authenticate);
	},
};
