export class Logger {
  public logMessage: string = "";
  constructor() {
    this.logMessage = "";
  }

  addLogMessage(message: string, type: "rtc" | "room") {
    this.logMessage += `[${type}]:${message}`;
  }

  getLogMessage() {
    return this.logMessage;
  }
}

export const logger = new Logger();
