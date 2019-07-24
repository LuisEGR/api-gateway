import { Logger } from 'logger-colors';

import app from './app';

const logger = new Logger();
const port: number = Number(process.env.PORT) || 3002;






app.listen(port, () => {
    logger.success("Servicio ejecutado exitosamente");
    logger.success(`Escuchando en el puerto ${port}`);
});

