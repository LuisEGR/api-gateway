import request from 'request';
import moment from 'moment-timezone';
import { DataGatewayController, ApiDescription } from './data.controller';
import {Logger, LColor} from 'logger-colors';

const dataCtrl = DataGatewayController.getInstance();
const logger = new Logger();

export function autoDiscovery(printAll: boolean = false) {
    return new Promise((resolve, reject) => {
        const services: any[] = [];
        let servicesProcesed = 0;
        const servicesFound = Object.keys(process.env)
            .filter((e) => {
                return  e.match(/^.*PORT_(\d+)\_TCP_ADDR/);
            });

        if (!servicesFound.length) resolve([]);
        servicesFound.forEach((s) => {
            const match = s.match(/^.*PORT_(\d+)\_TCP_ADDR/);
            const port =  match ? match[1] : null;
            const url = 'http://' + process.env[s] + ':' + port + '/describe';
            request.get(url, { timeout: 1000 }, (err, res, body) => {
                servicesProcesed++;
                if (err == null) {
                    let b: { apis: any; version?: any; service?: string };
                    try {
                        b = JSON.parse(body);
                    } catch (e) { // Error no JSON
                        b = {
                            apis: [],
                        };
                    }
                    b.apis = b.apis.map((api: any) => {
                            api.host = 'http://' + process.env[s];
                            if (b.service) {
                                api.host = 'http://' + b.service;
                            }
                            api.port = port;
                            api._id = Buffer.from(api.endpoint + api.method + api.host).toString('base64');
                            api._foundAt = moment().tz('America/Mexico_City').format();
                            api._lastRequest = null;
                            return api;
                        });

                    b.apis.forEach((api) => {
                        const apiToSave: ApiDescription = {
                            endpoint: api.endpoint,
                            host: api.host,
                            name: api.name,
                            port: api.port,
                            method: api.method,
                            version: b.version,
                            totalRequests: 0,
                        };
                        services.push(apiToSave);
                        dataCtrl.addApi(apiToSave).then((row) => {
                             if (typeof row !== 'string') {
                                 const infoApi = 'NEW API FOUND: ' +
                                 '[' + row.insertedId + '] ' +
                                 '[v' + apiToSave.version + '] ' +
                                 apiToSave.method + ' ' +
                                 apiToSave.host + ':' + apiToSave.port
                                 + '' + apiToSave.endpoint;
                                //  logger.info(infoApi);
                                 logger.warn(infoApi);
                             }
                        });
                    });
                }
                if (servicesProcesed === servicesFound.length) {
                    resolve(services);
                }
            });
        });
    }).then(async (apis) => {
        if (printAll) {
            const all = await dataCtrl.getAllApis();
            logger.info('');
            logger.info("[ SERVING APIS ]", true);
            logger.info('');
            all.forEach((api: ApiDescription) => {
                let logServing = '';
                logServing += getColor(api.method);
                logServing += api.method + ' ';
                logServing += LColor.c_gray;
                logServing += api.endpoint;
                logger.info(logServing);
            });
        }
        return apis;
    }).catch((e) => console.error(e));
}



function getColor(method: string) {
    switch (method) {
        case 'GET': return LColor.c_green;
        case 'POST': return LColor.c_cyan;
        default: return LColor.c_white;
    }
}
