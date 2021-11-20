import httpServer from '@server';
import logger from '@shared/Logger';


// Start the server
const port = Number(process.env.PORT || 3000);
httpServer.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
