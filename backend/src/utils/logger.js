const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ],
});

const logError = (error) => {
    logger.error(error);
};

const logInfo = (message) => {
    logger.info(message);
};

const logDebug = (message) => {
    logger.debug(message);
};

module.exports = {
    logError,
    logInfo,
    logDebug,
};