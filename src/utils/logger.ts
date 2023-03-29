import winston, { format } from "winston";
const { combine, timestamp, label, prettyPrint } = format

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        format.splat(),
        timestamp(),
        winston.format.json(),
    )
});

function getLogger() {
    return logger
}

export default getLogger