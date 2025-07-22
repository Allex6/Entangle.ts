import { ILogger, ILog, ELogType } from '../shared/types/Logging.types';

export class ConsoleLogger implements ILogger {
  private getTypeIcon(type: ELogType): string {
    switch (type) {
      case ELogType.CREATION:
        return '✨';
      case ELogType.DESTRUCTION:
        return '💥';
      case ELogType.INTERACTION:
        return '↔️ ';
      case ELogType.ERROR:
        return '❌';
      default:
        return '➡️';
    }
  }

  public log(logDetails: ILog): void {
    const icon = this.getTypeIcon(logDetails.type);
    console.log(`[Entangle.ts] ${icon} ${logDetails.message}`);
  }
}
