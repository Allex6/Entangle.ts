import { ILogger, ILog, LoggingMode, ELogType } from '../shared/types/Logging.types';

export class Logging {
  constructor(
    private readonly mode: LoggingMode,
    private readonly logger: ILogger,
    private readonly logTypes: ELogType[] = [
      ELogType.CREATION,
      ELogType.INTERACTION,
      ELogType.ERROR,
    ]
  ) {}

  public log(logDetails: ILog): void {
    if (this.canLog(logDetails)) {
      this.logger.log(logDetails);
    }
  }

  private canLog(logDetails: ILog): boolean {
    if (this.mode === 'off') {
      return false;
    }

    if (this.mode === 'debug') {
      return true;
    }

    return this.logTypes.includes(logDetails.type);
  }
}
