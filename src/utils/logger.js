class Logger {
  constructor() { this.serviceName = 'web-calculator'; }
  formatMessage(level, message, meta = {}) {
    return { timestamp: new Date().toISOString(), level, service: this.serviceName, message, ...meta };
  }
  info(message, meta = {}) { console.log(`[${this.formatMessage('info', message).timestamp}] INFO: ${message}`, meta); }
  error(message, meta = {}) { console.error(`[${this.formatMessage('error', message).timestamp}] ERROR: ${message}`, meta); }
}
export default new Logger();
