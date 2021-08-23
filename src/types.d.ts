export interface ITemperatureWithProbeId {
  readonly probeId: string;
  readonly temperature: number; // in °C
}

/**
 * The key is the probe ID.
 */
export interface ITemperatureReading {
  readonly  [key: string]: ITemperatureWithProbeId
}

export type LogEntry<TLogItem> = {
  readonly timestamp: Date;
  readonly item: TLogItem;
};

export type LogEntryJson<TLogItem> = {
  readonly timestamp: string;
  readonly item: TLogItem;
};

export type Log<TLogItem> = Array<LogEntry<TLogItem>>;

export type LogJson<TLogItem> = Array<LogEntryJson<TLogItem>>;

export type Config = {
  readonly probesUrl: string;
  readonly probingIntervalMs: number,
  readonly readingsJSonPath: string;
  readonly numberOfReadingsToKeep: number;
};
