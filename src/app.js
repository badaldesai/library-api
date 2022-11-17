const database = require('./database');
const middleware = require('./middleware');
const routes = require('./routes');
const { log } = require('./utils');

function setupResources(app) {
	log.info('loading resources');
	middleware.registerMiddleware(app);
	routes.initialize(app);
	middleware.registerErrorHandlers(app);
}

async function startServer(app) {
	await database.initialize();
	setupResources(app);

	app.listen(process.env.PORT);
	log.info(`server started on ${process.env.PORT}`);
}

module.exports = {
	startServer,
};
