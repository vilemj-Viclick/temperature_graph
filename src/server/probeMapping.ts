import {
  IProbeInfoDictionary,
  ITemperatureReading,
  Log,
  Writeable,
} from '../types';
import { getRainbow } from '../utils/rainbow';
import { getFirst } from '../utils/generalUtils';

export const getProbeMappings = (log: Log<ITemperatureReading>): IProbeInfoDictionary => {
  return log.reduce((result, logEntry) => {
    const logItem = logEntry.item;
    const currentProbeIds = Object.keys(logItem);

    currentProbeIds.forEach(probeId => {
      if (!result[probeId]) {
        result[probeId] = {
          probeName: getProbeName(probeId),
          color: getProbeColor(probeId),
        };
      }
    });

    return result;
  }, {} as Writeable<IProbeInfoDictionary>);
};

const probeMapping = {
  '28c04bdc060000da': {
    probeName: 'Plášť',
    color: 'rgb(75, 192, 192)',
  },
  '28ac73e7050000e6': {
    probeName: 'Medium',
    color: 'rgb(48, 137, 34)',
  },
};

const unknownProbeColors = {};

const getProbeName = (probeId: string): string => {
  const knownProbe = probeMapping[probeId];
  if (knownProbe) {
    return knownProbe.probeName;
  }
  else {
    return probeId;
  }
};

const getProbeColor = (probeId: string): string => {
  const knownProbe = probeMapping[probeId];
  if (knownProbe) {
    return knownProbe.color;
  }
  else if (unknownProbeColors[probeId]) {
    return unknownProbeColors[probeId];
  }
  else {
    const palette = getRainbow(5);
    const firstUnusedColor = palette.find(colorCandidate => !Object.values(unknownProbeColors).includes(colorCandidate));

    const usedColor = (firstUnusedColor ?? getFirst(palette)) as string;

    unknownProbeColors[probeId] = usedColor;

    return usedColor;
  }
};
