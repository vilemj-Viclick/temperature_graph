import fetch from 'node-fetch';
import { setInterval } from 'timers/promises';
import {
  Config,
  ITemperatureReading,
  Log,
} from '../../types';
import {
  getLast,
  log,
  prettyPrint,
} from '../../utils/generalUtils';
import { parseReading } from './temperatureParsing';

export const createTemperatureReader = (config: Config) => {
  const getReadings = {
    async* [Symbol.asyncIterator]() {
      for await(const _start of setInterval(config.probingIntervalMs, Date.now())) {
        try {
          const temperaturesText = await (await fetch(config.probesUrl)).text();
          const reading = parseReading(temperaturesText);

          yield reading;
        }
        catch (e) {
          log('Failed reading!!! Cause follows:');
          log(e);
          yield null;
        }
      }
    },
  };

  const temperatureReader = {
    async* [Symbol.asyncIterator]() {
      let temperatureProbeReadings: Log<ITemperatureReading> = [];

      for await (const reading of getReadings) {
        if (reading) {
          prettyPrint(reading);

          const lastReading = getLast(temperatureProbeReadings);
          const correctedReading = Object.keys(reading).reduce((correctedReadingResult, probeId) => {
            const lastProbeTemp = lastReading?.item[probeId]?.temperature;
            if (lastProbeTemp && (Math.abs(lastProbeTemp - reading[probeId].temperature) > config.maxTemperatureDeltaInInterval)) {
              log(`Skipping a reading of '${probeId}' because the temperature read is too fa from the last one.`);
              return correctedReadingResult;
            }

            correctedReadingResult[probeId] = reading[probeId];
            return correctedReadingResult;
          }, {});

          temperatureProbeReadings.push({
            timestamp: new Date(),
            item: correctedReading,
          });

          temperatureProbeReadings = temperatureProbeReadings.slice(temperatureProbeReadings.length - config.numberOfReadingsToKeep);
        }
        yield temperatureProbeReadings;
      }
    },
  };

  return temperatureReader;
};
