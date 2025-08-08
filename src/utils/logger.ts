import chalk from 'chalk';

enum LogLevel {
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

function formatMessage(level: LogLevel, message: string): string {
    const time = new Date().toISOString();
    const base = `[${time}] [${level}] ${message}`;

    switch (level) {
        case LogLevel.INFO:
            return chalk.cyan(base);
        case LogLevel.DEBUG:
            return chalk.gray(base);
        case LogLevel.WARN:
            return chalk.yellow(base);
        case LogLevel.ERROR:
            return chalk.red(base);
        default:
            return base;
    }
}

export const logger = {
    info: (message: string) => {
        console.log(formatMessage(LogLevel.INFO, message));
    },
    debug: (message: string) => {
        console.debug(formatMessage(LogLevel.DEBUG, message));
    },
    warn: (message: string) => {
        console.warn(formatMessage(LogLevel.WARN, message));
    },
    error: (message: string) => {
        console.error(formatMessage(LogLevel.ERROR, message));
    }
};
