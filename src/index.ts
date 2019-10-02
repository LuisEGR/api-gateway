import { Logger } from 'logger-colors';
import express from 'express';
import { autoDiscovery } from './controllers/apis.controller';
import { GatewayController } from './controllers/gateway.controller';
import { DataGatewayController } from './controllers/data.controller';

const logger = new Logger();
const port: number = Number(process.env.PORT) || 3002;

const dataC = DataGatewayController.getInstance();

const app: express.Application = express();


const timeInt = parseInt(process.env.INTERVAL_DISCOVERY || '6000', 10);
// Find apis every 1 minute
setInterval(() => {
    autoDiscovery();
}, timeInt);

autoDiscovery(true);

app.get('/describe', (req, res) => {
    res.sendStatus(404);
});

app.get('/discover', (req, res) => {
    dataC.deleteCache();
    autoDiscovery().then((apis) => {
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.send(apis);
    });
});

app.use(GatewayController);

app.listen(port, () => {
    logger.success('');
    logger.success("API Gateway Ready", true);
    logger.success(`Listening on port ${port}`, true);
});

export default app;



