const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../database/models/user');
const { log } = require('../utils');

module.exports = {
	register: async ({
		first_name, last_name, username, password,
	}) => {
		const oldUser = await userModel.findOne({ username });
		if (oldUser) {
			log.error('User already exist');
			throw Boom.conflict('User Already Exist. Please Login');
		}
		const encryptedPassword = await bcrypt.hash(password, 10);
		const user = await userModel.create({
			first_name,
			last_name,
			username: username.toLowerCase(),
			password: encryptedPassword,
		});
		const token = jwt.sign(
			{ userId: user._id, username },
			process.env.SECRET,
			{ expiresIn: '2h' },
		);
		user.token = token;
		return user;
	},
	login: async ({ username, password }) => {
		const user = await userModel.findOne({ username });
		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign(
				{ userId: user._id, username },
				process.env.SECRET,
				{ expiresIn: '2h' },
			);
			user.token = token;
			return user;
		}
		throw Boom.unauthorized('User is not authenticated');
	},
};
