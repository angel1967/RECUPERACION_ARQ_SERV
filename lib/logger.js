const { createLogger, format, transports } = require('winston');

const logger = (moduleName) => {
  let timestampFormat = '';
  const customFormat = format.printf((info) => {
    if (Object.prototype.hasOwnProperty.call(info, 'message')) {
      const level = JSON.stringify(info.level);
      if (level.includes('debug')) {
        return `${info.timestamp} - ${info.level}: [${moduleName}.js] ${JSON.stringify(info.message)}`;
      }
      return `${info.timestamp} - ${info.level}: [${moduleName}.js] ${info.message}`;
    }
    return `No Message ${info.timestamp} - ${info.level}: [${moduleName}.js] ${JSON.stringify(info)}`;
  });

  if (process.env.NODE_ENV === 'local') {
    timestampFormat = 'YYYY-MM-DD HH:mm:ss';
  }

  return createLogger({
    transports: [
      new transports.Console({
        level: process.env.loggerLevel ? process.env.loggerLevel : 'info',
        format: format.combine(format.colorize(), format.timestamp({ format: timestampFormat }), customFormat)
      })
    ]
  });
};

module.exports = logger;
