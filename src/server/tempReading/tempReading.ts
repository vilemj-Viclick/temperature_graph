import fetch from 'node-fetch';
import {
  Config,
  ITemperatureReading,
  Log,
} from '../../types';
import {
  getLast,
  log,
} from '../../utils/generalUtils';
import { parseReading } from './temperatureParsing';


export const createTemperatureReader = (config: Config) => {
  let temperatureProbeReadings: Log<ITemperatureReading> = [];

  const getReading = async (): Promise<ITemperatureReading> => {
    try {
      const temperaturesText = await (await fetch(config.probesUrl, { timeout: config.probeRequestTimeoutMs })).text();
      const reading = parseReading(temperaturesText);

      return reading;
    }
    catch (e) {
      log('Failed reading!!! Cause follows:');
      log(e);
      return {};
    }
  };

  const getNextReadings = async () => {
    const newReading = await getReading();
    // prettyPrint(newReading);
    const ensuredReading = newReading ?? {};

    const lastReading = getLast(temperatureProbeReadings);
    const correctedReading = Object.keys(ensuredReading).reduce((correctedReadingResult, probeId) => {
      const lastProbeTemp = lastReading?.item[probeId]?.temperature;
      if (lastProbeTemp && (Math.abs(lastProbeTemp - ensuredReading[probeId].temperature) > config.maxTemperatureDeltaInInterval)) {
        log(`Skipping a reading of '${probeId}' because the temperature read is too fa from the last one.`);
        return correctedReadingResult;
      }

      correctedReadingResult[probeId] = ensuredReading[probeId];
      return correctedReadingResult;
    }, {});

    temperatureProbeReadings.push({
      timestamp: new Date(),
      item: correctedReading,
    });

    temperatureProbeReadings = temperatureProbeReadings.slice(temperatureProbeReadings.length - config.numberOfReadingsToKeep);
    return temperatureProbeReadings;
  };

  return {getNextReadings};
};
