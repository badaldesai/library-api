const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');
const utils = require('../utils');
const { log } = require('../utils');

const EXEMPT_AUTH_METHODS = {
	'/user/login': ['POST'],
	'/user/register': ['POST'],
};

module.exports = {
	authenticate: async (req, res, next) => {
		const requiresValidation = typeof EXEMPT_AUTH_METHODS[req.path] === 'undefined'
				|| EXEMPT_AUTH_METHODS[req.path].indexOf(req.method) < 0;
		if (!requiresValidation) {
			return next();
		}
		const { value, error } = utils.headerValidationSchema.validate(req.headers);
		if (error) {
			log.error('Bad request');
			return next(Boom.badRequest(error));
		}
		const { authorization } = value;
		try {
			const decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET);
			req.userId = decodedToken.userId;
		} catch (err) {
			return next(Boom.unauthorized('Wrong token, login again'));
		}
		return next();
	},
};
