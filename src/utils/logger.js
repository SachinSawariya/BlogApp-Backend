const { createLogger, format, transports } = require('winston');
const moment = require('moment-timezone');
const morgan = require('morgan');


module.exports = createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.printf((info) => {
                    if (info.stack) {
                        return `${info.stack}`;
                    }
                    return `${info.message}`;
                })
            ),
        }),
        new transports.File({
            filename: `logs/error/${moment().format("MMM-DD-YYYY")}.log`,
            name: "file#error",
            level: "error",
            format: format.combine(
                format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
                format.align(),
                format.printf(
                    (info) => `${info.level}: ${[info.timestamp]}: ${info.stack}`
                )
            ),
        }),
        new transports.File({
            filename: `logs/info/${moment().format("MMM-DD-YYYY")}.log`,
            name: "file#info",
            level: "info",
            format: format.combine(
                format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
                format.align(),
                format.printf(
                    (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
                )
            ),
        }),
    ],
});
module.exports.morganInstance = morgan('dev', {
    stream: {
        write: (str) => {
            logger.info(str);
        },
    },
});
