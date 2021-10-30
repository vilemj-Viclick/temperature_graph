import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import { AddressInfo } from 'net';
import path from 'path';
import { compileClient } from '../temperature-reader-server/compiling/compileClient';
import { getProbeMappings } from '../temperature-reader-server/probeMapping';
import { getStaticRoutes } from '../temperature-reader-server/routing';
import {
  ITemperatureReading,
  Log,
  ViewModelServer,
} from '../types';
import {
  prettify,
  prettyPrint,
} from '../utils/generalUtils';

const main = async () => {
  let lastReadingLog: Log<ITemperatureReading> = [];

  const app = express();

  // Set up logging
  app.use(morgan('dev'));

  // Set up client compilations
  compileClient(app);
  app.use(bodyParser.json());

  // Set up routing
  app.use(express.static(path.join(__dirname, '../../public')));
  const router = express.Router();
  router.get('/readings.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const response: ViewModelServer = {
      log: lastReadingLog,
      probeInfos: getProbeMappings(lastReadingLog),
    };

    res.end(prettify(response));
  });
  router.post('/readings', (req, res) => {
    prettyPrint(req.body);
    lastReadingLog = req.body;
    res.end();
  });
  app.use('/', getStaticRoutes(router));

  // Launch server
  app.set('port', process.env.PORT || 3002);
  const server = app.listen(app.get('port'), () => {
    const port = (server.address() as AddressInfo).port;
    console.log('Express server listening on port ' + port);
  });
};


main();
