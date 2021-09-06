import express from 'express';
import morgan from 'morgan';
import { AddressInfo } from 'net';
import open from 'open';
import path from 'path';
import {
  Config,
  ITemperatureReading,
  Log,
  ViewModelServer,
} from '../types';
import {
  getLast,
  prettify,
  prettyPrint,
} from '../utils/generalUtils';
import { compileClient } from './compiling/compileClient';
import { saveAsJson } from './fileManipulation';
import { getProbeMappings } from './probeMapping';
import { getStaticRoutes } from './routing';
import { createTemperatureReader } from './tempReading/tempReading';

const config: Config = {
  probesUrl: 'http://sondy/',
  // probesUrl: 'http://localhost:3001/',  // For testing purposes
  probingIntervalMs: 5000,
  readingsJSonPath: './public/files/readings.json',
  numberOfReadingsToKeep: 1800 / 5, // Half an hour
  maxTemperatureDeltaInInterval: 5,
  probeRequestTimeoutMs: 4000,
};

const startTemperatureLogging = async (updateTempLog: (log: Log<ITemperatureReading>) => void) => {
  const tempReader = createTemperatureReader(config);

  setInterval(async ()=>{
    const readingLog = await tempReader.getNextReadings();
    prettyPrint(getLast(readingLog));
    saveAsJson(readingLog, path.join(__dirname, '../..', config.readingsJSonPath));
    updateTempLog(readingLog);
  },config.probingIntervalMs);
};

const main = async () => {
  let lastReadingLog: Log<ITemperatureReading> = [];
  startTemperatureLogging(log => {
    lastReadingLog = log;
  });

  const app = express();
  // Set up logging
  app.use(morgan('dev'));
  // Set up client compilations
  compileClient(app);
  // Set up routing
  const router = express.Router();
  router.get('/readings.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const response: ViewModelServer = {
      log: lastReadingLog,
      probeInfos: getProbeMappings(lastReadingLog),
    };

    res.end(prettify(response));
  });
  app.use('/', getStaticRoutes(router));

  // Launch server
  app.set('port', process.env.PORT || 3000);
  const server = app.listen(app.get('port'), () => {
    const port = (server.address() as AddressInfo).port;
    console.log('Express server listening on port ' + port);

    open('http://localhost:' + port);
  });
};


main();
