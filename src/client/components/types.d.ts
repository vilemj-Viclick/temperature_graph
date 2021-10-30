
export interface ProbeResult {
  readonly max: boolean;
  readonly min: boolean;
  readonly rise: boolean;
  readonly decline: boolean;
}

export interface ProbeResults {
  readonly [probeId: string]: ProbeResult;
}

export interface AlertSettings {
  readonly [probeId: string]: ProbeAlertSettings;
}

export interface ProbeAlertSettings {
  readonly min?: number;
  readonly max?: number;
  readonly rise?: IDelta;
  readonly decline?: IDelta;
}

export interface IDelta {
  readonly timeMs: number;
  readonly temperatureDelta: number;
}
