const express = require('express');
const dotenv = require('dotenv');

const envFile = process.env.ENV_FILE || '.env';

// eslint-disable-next-line no-console
console.log(envFile);
dotenv.config({ path: envFile });

const { startServer } = require('./src/app');

startServer(express())
	.catch((err) => {
		if (err) {
			// eslint-disable-next-line no-console
			console.error(err.stack);

			process.exit(1);
		}
	});
