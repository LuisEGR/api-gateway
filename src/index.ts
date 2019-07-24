import { Logger } from 'logger-colors';
import express from 'express';
import { autoDiscovery } from './controllers/apis.controller';
import { GatewayController } from './controllers/gateway.controller';


const logger = new Logger();
const port: number = Number(process.env.PORT) || 3002;



const app: express.Application = express();
autoDiscovery(true).then(() => {
    app.listen(port, () => {
        logger.success('');
        logger.success("API Gateway Ready", true);
        logger.success(`Listening on port ${port}`, true);
    });
});

const timeInt = parseInt(process.env.INTERVAL_DISCOVERY || '6000', 10);
// Find apis every 1 minute
setInterval(() => {
    autoDiscovery();
}, timeInt);


app.get('/discover', (req, res) => {
    autoDiscovery().then((apis) => {
        res.send(apis);
    });
});

app.use(GatewayController);


export default app;



