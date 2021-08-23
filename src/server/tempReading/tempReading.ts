import fetch from 'node-fetch';
import { setInterval } from 'timers/promises';
import {
  Config,
  ITemperatureReading,
  Log,
} from '../../types';
import { prettyPrint } from '../../utils/utils';
import { parseReading } from './temperatureParsing';

export const createTemperatureReader = (config: Config) => {
  const getReadings = {
    async* [Symbol.asyncIterator]() {
      for await(const _start of setInterval(config.probingIntervalMs, Date.now())) {
        const temperaturesText = await (await fetch(config.probesUrl)).text();
        const reading = parseReading(temperaturesText);

        yield reading;
      }
    },
  };

  const temperatureReader = {
    async* [Symbol.asyncIterator]() {
      let temperatureProbeReadings: Log<ITemperatureReading> = [];

      for await (const reading of getReadings) {
        prettyPrint(reading);
        temperatureProbeReadings.push({
          timestamp: new Date(),
          item: reading,
        });

        temperatureProbeReadings = temperatureProbeReadings.slice(0, config.numberOfReadingsToKeep);

        yield temperatureProbeReadings;
      }
    },
  };

  return temperatureReader;
};
