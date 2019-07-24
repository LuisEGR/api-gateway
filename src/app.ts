import express from 'express';
import {autoDiscovery} from './controllers/Apis.controller';
import { GatewayController } from './controllers/gateway.controller';
import fs from 'fs';
import bodyParser = require('body-parser');
import compression from 'compression';

const app: express.Application = express();

const servicesDiscovered = [];

autoDiscovery().then((services: any) => {
    console.log("services:", services);
    fs.writeFileSync('routes.json', JSON.stringify(services, null, 4));
}).catch((e: any) => {
    console.error("ErrorGFa", e);
});

app.use(GatewayController);



export default app;
