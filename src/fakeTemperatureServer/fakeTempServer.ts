import express from 'express';
import morgan from 'morgan';
import { AddressInfo } from 'net';
import {
  log,
  prettyPrint,
} from '../utils/generalUtils';

const flipCoin = (chance: number): boolean => {
  return Math.random() <= chance;
};

const getRandomNumberBetween = (min:number, max:number) => min + (Math.random() * (max-min));

const renderTemperature = (num:number):string => {
  return `${num>=0?'+': '-'}${num.toFixed(1)}`
};

const getRandomTemperature = ():string => {
  const num = getRandomNumberBetween(85,90);
  return renderTemperature(num);
};

const knownProbeIds = ['28c04bdc060000da', '28ac73e7050000e6'];
const unknownProbeIds = ['randomstring', 'Uááááááááááááá!!!'];

const generateFakeTemperatureResponse = ():string => {
  const knownLines = knownProbeIds.map(probeId => {
    if(flipCoin(0.95)){
      return `${probeId} ${getRandomTemperature()}`
    }

    return null;
  });

  const unknownLines = unknownProbeIds.map(probeId => {
    if(flipCoin(0.02)){
      return `${probeId} ${getRandomTemperature()}`
    }

    return null;
  });

  const allLines = [...knownLines, ...unknownLines];

  return allLines.filter(Boolean).join('\n');
};

const main = async () => {
  const app = express();
  // Set up logging
  app.use(morgan('dev'));
  // Set up routing
  const router = express.Router();
  router.get('/', (_req, res) => {
    res.setHeader('Content-Type', 'application/text');

    const response = generateFakeTemperatureResponse();

    prettyPrint(response);

    res.end(response);
  });

  app.use(router);
  // Launch server
  app.set('port', process.env.PORT || 3001);
  const server = app.listen(app.get('port'), () => {
    const port = (server.address() as AddressInfo).port;
    log('Express server listening on port ' + port);
    log('Fake temperature server started!');
  });
};


main();
