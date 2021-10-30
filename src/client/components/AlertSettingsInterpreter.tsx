import React, { useEffect } from 'react';
import { ViewModelClient } from '../../types';
import { getLast } from '../../utils/generalUtils';
import {
  AlertSettings,
  ProbeAlertSettings,
  ProbeResult,
  ProbeResults,
} from './types';

export interface AlertSettingsInterpreterProps {
  readonly readings: ViewModelClient;
  readonly alertSettings: AlertSettings;
  readonly onChange: (isAlertTriggered: boolean, probeResults: ProbeResults) => void;
}

interface ProbeReading {
  readonly timeStamp: Date;
  readonly temperature: number;
}

const isMaxTriggered = (readings: ReadonlyArray<ProbeReading>, settings: ProbeAlertSettings) => {
  if (settings.max !== undefined) {
    const lastReading = getLast(readings);
    if (lastReading) {
      return (lastReading.temperature >= settings.max);
    }
  }

  return false;
};

const isMinTriggered = (readings: ReadonlyArray<ProbeReading>, settings: ProbeAlertSettings) => {
  if (settings.min !== undefined) {
    const lastReading = getLast(readings);
    if (lastReading) {
      return (lastReading.temperature <= settings.min);
    }
  }

  return false;
};

const isAnyProbeTriggered = (probeResults: ProbeResults): boolean => {
  return Object.values(probeResults).reduce((result, probeResult) => result || probeResult.max || probeResult.min || probeResult.rise || probeResult.decline, false);
};

export const AlertSettingsInterpreter: React.FC<AlertSettingsInterpreterProps> = ({
  readings,
  alertSettings,
  onChange,
}) => {
  useEffect(() => {
    const probeResults = Object.keys(alertSettings).reduce((result, probeId) => {
      const probeSettings = alertSettings[probeId];
      const probeReadings: ReadonlyArray<ProbeReading> = readings.log.map(logItem => ({
        timeStamp: new Date(logItem.timestamp),
        temperature: logItem.item[probeId]?.temperature,
      })).filter(item => (item.temperature ?? undefined) !== undefined);
      if (probeSettings) {
        const probeResult: ProbeResult = {
          max: isMaxTriggered(probeReadings, probeSettings),
          min: isMinTriggered(probeReadings, probeSettings),
          rise: false,
          decline: false,
        };
        return {
          ...result,
          [probeId]: probeResult,
        };
      }

      return result;
    }, {});

    onChange(isAnyProbeTriggered(probeResults), probeResults);
  }, [readings, alertSettings]);


  return null;
};
