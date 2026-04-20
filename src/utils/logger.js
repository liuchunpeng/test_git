/**
 * 日志工具 - 统一日志模块
 * 用于记录计算器应用的运行时日志
 */

class Logger {
  constructor() {
    this.serviceName = 'web-calculator';
  }

  formatMessage(level, message, meta = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      ...meta
    };
  }

  info(message, meta = {}) {
    const log = this.formatMessage('info', message, meta);
    console.log(`[${log.timestamp}] INFO: ${message}`, meta);
    return log;
  }

  warn(message, meta = {}) {
    const log = this.formatMessage('warn', message, meta);
    console.warn(`[${log.timestamp}] WARN: ${message}`, meta);
    return log;
  }

  error(message, meta = {}) {
    const log = this.formatMessage('error', message, meta);
    console.error(`[${log.timestamp}] ERROR: ${message}`, meta);
    return log;
  }

  debug(message, meta = {}) {
    if (import.meta.env?.DEV) {
      const log = this.formatMessage('debug', message, meta);
      console.debug(`[${log.timestamp}] DEBUG: ${message}`, meta);
      return log;
    }
  }
}

const logger = new Logger();
export default logger;
