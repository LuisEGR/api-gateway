import { Request, Response, Router } from 'express';
import { Logger, LColor } from 'logger-colors';
import request from 'request';
import { DataGatewayController, ApiSearch, ApiDescription } from './data.controller';
import { IncomingMessage } from 'http';
import { BodyProcessor } from '../extras/BodyProcessor.class';
const router: Router = Router();
const logger = new Logger();
const dataCtrl = DataGatewayController.getInstance();
const separador = '----------------------------------------------------';

const startRequest = (req, res, api) => {
    const actualTime = (new Date()).getTime();
    let totalTime = 0;

    const bodyRequest = new BodyProcessor();
    const bodyResponse = new BodyProcessor();

    req.on('data', (c) => bodyRequest.save(c));
    req.on('end', () => bodyRequest.emit('ready', bodyRequest.getBody()));


    // logger.info(api._id + '', true);
    const fullUrl = api.host + ':' + api.port + api.endpoint;
    const re = request[api.method.toLowerCase()](fullUrl, {
        headers: {
            'accept-encoding': 'identity', // Evitar GZIP para poder hacer log
        },
    });

    re.on('response', (response: IncomingMessage) => {

        response.on('data', (c) => bodyResponse.save(c));
        response.on('end', () => bodyResponse.emit('ready', bodyResponse.getBody()));
        response.on('end', () => {
            const endTime = (new Date()).getTime();
            totalTime = endTime - actualTime;
            logger.success('');
            logger.success('');
            logger.success(api.name + ' v' + api.version, true);
            logger.success(api.endpoint, true);
            logger.success('FROM:\t' + getIp(req), false);
            logger.success('USER:\t' + getUser(req), false);
            logger.success('TIME:\t' + totalTime + 'ms', false);
            logger.info(separador);
            logger.cyan('REQUEST', true);
            logger.cyan('METHOD:\t' + api.method, false);
            logger.cyan('URL:   \t' + fullUrl, false);
            logger.cyan('HEADERS:', false);
            Object.keys(req.headers).forEach((h) => {
                // logger.cyan(h + ":\t" + req.headers[h], false);
                logger.cyan('- ' + h + ": " + LColor.c_white + req.headers[h] + LColor.c_cyan, false);

            });
            // logger.cyan(JSON.stringify(req.headers), false);
            logger.cyan('', false);
            logger.cyan('BODY:', false);
            const lineasBodyRequest = bodyRequest.getBody().split('\n');
            lineasBodyRequest.forEach((l) => {
                logger.cyan(l, false);
            });
            // logger.cyan(bodyRequest.getBody(), false);
            logger.info(separador);

            logger.magenta('RESPONSE:', true);
            logger.magenta('STATUS: [' +
                `${LColor.c_white}${response.statusCode} ` +
                `${response.statusMessage}${LColor.c_magenta}]`, false);
            logger.magenta('');
            logger.magenta('HEADERS');
            Object.keys(response.headers).forEach((h) => {
                logger.magenta('- ' + h + ": " + LColor.c_white + response.headers[h] + LColor.c_magenta, false);
            });
            // logger.magenta(JSON.stringify(response.headers), false);
            logger.magenta('');
            logger.magenta('BODY');
            // logger.magenta(bodyResponse.getBody(), false);
            const lineasBody = bodyResponse.getBody().split('\n');
            lineasBody.forEach((l) => {
                logger.magenta(l, false);
            });

            logger.info('');
            logger.info('END RESPONSE', true);
            logger.info(separador);
            logger.info('');
            logger.info('');
            logger.info('');


        });

    });

    req.on('error', (err) => {
        logger.error("1-REQUEST ERROR:", err);
        sendError(res, err, api);
    });

    re.on('error', (err) => {
        console.error("2-REQUEST ERROR:", err);
        sendError(res, err, api);
    });

    req.pipe(re).pipe(res);
};

function getIp(req: Request) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip;
}

function getUser(req: Request) {
    return req.headers['iv-user'] || 'desconocido';
}

function sendError(res: Response, error: any, api: ApiDescription) {
    if (error.code === 'ECONNREFUSED') {
        res.status(500).send({
            message: "Gateway can't connect to service: " + api.name,
            code: error.code,
            port: error.port,
        });
    } else {
        res.status(500).send(error);
    }
}

router.all('*', (req: Request, res: Response) => {


    const apib: ApiSearch = { method: req.method, endpoint: req.url };
    dataCtrl
        .getApi(apib)
        .then((api) => {
            if (api) {
                logger.info(separador);
                logger.info("Processing request: " + req.method + ' ' + req.url);
                logger.info('', true);
                startRequest(req, res, api);
            } else {
                res.sendStatus(404);
            }
        });
});


export const GatewayController: Router = router;
