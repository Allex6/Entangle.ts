export type LoggingMode = 'custom' | 'debug' | 'off';

export enum ELogType {
  CREATION = 'CREATION',
  DESTRUCTION = 'DESTRUCTION',
  INTERACTION = 'INTERACTION',
  ERROR = 'ERROR',
}

export interface ILog {
  type: ELogType;
  message: string;
}

export interface ILogger {
  log: (logDetails: ILog) => void;
}
