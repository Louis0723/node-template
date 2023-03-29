import * as line from "@line/bot-sdk";
import express from "express";
import { GetConfig } from '../../config/config';
import getLogger from "../../utils/logger";
import HandleEvent from './handle';


const logger = getLogger()
function AddLineRoute(): express.Router {
    logger.info('AddLineRoute')
    const lineRoute = express.Router()

    // line token and secret
    const config: line.Config = {
        channelAccessToken: GetConfig().Line.ChannelAccessToken,
        channelSecret: GetConfig().Line.ChannelSecret,
    }
    if (config.channelAccessToken == undefined) {
        const lineHandle = HandleEvent(config)

        lineRoute.post('/callback', line.middleware(config as line.MiddlewareConfig), (req, res) => {
            logger.info('telegram msg', req.body.events)
            Promise
                .all(req.body.events.map(lineHandle))
                .then((result) => res.json(result))
                .catch((err) => {
                    console.error(err.body);
                    res.status(500).end();
                });
        });
    }
    return lineRoute
}
export default AddLineRoute