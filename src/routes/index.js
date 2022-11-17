const user = require('./user');
const reservation = require('./reservations');

module.exports = {
	initialize: (app) => {
		if (!app) {
			throw new Error('app context is required to initialize routes');
		}
		// register all resources
		user(app);
		reservation(app);
	},
};
