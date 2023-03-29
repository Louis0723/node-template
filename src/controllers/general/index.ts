import express from "express";
import CallOpenAI from '../../module/openai';
import getLogger from "../../utils/logger";

const logger = getLogger()
function AddGeneralRoute(): express.Router {
    logger.info('AddGeneralRoute')
    const generalRoute = express.Router()

    generalRoute.post('/', express.json(), async (req, res) => {
        let text: string = ''
        if (req.is('text/*')) {
            text = req.body
        } else if (req.is('*/json') || req.is('json')) {
            text = req.body.message
            if (!(typeof text === 'string' && (text as string).length > 0)) {
                res.status(500).end();
                return
            }
        } else {
            res.status(500).end();
            return
        }

        const replyText = await CallOpenAI(text, 0)
        res.send(replyText)
    });

    return generalRoute
}
export default AddGeneralRoute