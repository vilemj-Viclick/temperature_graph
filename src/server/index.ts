import express from 'express';
import morgan from 'morgan';
import open from 'open';
import path from 'path';
import { compileClient } from './compiling/compileClient';
import { saveAsJson } from './fileManipulation';
import { getStaticRoutes } from './routing';
import { createTemperatureReader } from './tempReading/tempReading';
import {
  Config,
  ITemperatureReading,
  Log,
} from '../types';
import {
  getLast,
  prettify,
  prettyPrint,
} from '../utils/utils';

const config: Config = {
  probesUrl: 'http://sondy/',
  probingIntervalMs: 5000,
  readingsJSonPath: './public/files/readings.json',
  numberOfReadingsToKeep: 1800 / 5, // Half an hour
};

const startTemperatureLogging = async (updateTempLog: (log: Log<ITemperatureReading>) => void) => {
  for await (const readingLog of createTemperatureReader(config)) {
    prettyPrint(getLast(readingLog));
    saveAsJson(readingLog, path.join(__dirname, '../..', config.readingsJSonPath));
    updateTempLog(readingLog);
  }
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
    res.end(prettify(lastReadingLog));
  });
  app.use('/', getStaticRoutes(router));

  // Launch server
  app.set('port', process.env.PORT || 3000);
  const server = app.listen(app.get('port'), () => {
    const port = server.address()?.port!;
    console.log('Express server listening on port ' + port);

    open('http://localhost:' + port);
  });
};


main();
