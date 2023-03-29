require('dotenv').config()

import express from "express";
import expressWinston from "express-winston";
import AddGeneralRoute from "./controllers/general";
import AddLineRoute from "./controllers/line";
import AddTelegramBot from "./controllers/telegram";
import getLogger from "./utils/logger";
function appEntry() {
	const logger = getLogger()
	// create server
	const app: express.Application = express();

	// before
	app.use(expressWinston.logger(getLogger()));

	// route
	app.use('/general', AddGeneralRoute())
	app.use('/line', AddLineRoute())
	app.use('/telegram', AddTelegramBot())


	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		logger.info(`listening on ${port}`);
	});
}
appEntry()