import express from 'express';
import morgan from 'morgan';
import { AddressInfo } from 'net';
import { log } from '../utils/generalUtils';

const flipCoin = (chance: number): boolean => {
  return Math.random() <= chance;
};

const getRandomNumberBetween = (min: number, max: number) => min + (Math.random() * (max - min));

const renderTemperature = (num: number): string => {
  return `${num >= 0 ? '+' : '-'}${num.toFixed(1)}`;
};

type ProbeInfo = {
  readonly probeId: string;
  readonly chanceOfGettingRead: number;
  readonly usualMaxTemperatureVariation: number;
  readonly hiccupChance: number;
  readonly flipDirectionChance: number;
}

type ProbeInfos = {
  readonly [key: string]: ProbeInfo;
};

type ProbeState = {
  readonly temperatureEvolutionDirection: 'up' | 'down';
  readonly lastSeriousTemperature: number;
  readonly temperature: number;
};

type ProbeStates = {
  [key: string]: ProbeState;
};

const probeInfos: ProbeInfos = {
  ['28c04bdc060000da']: {
    probeId: '28c04bdc060000da',
    chanceOfGettingRead: 0.98,
    hiccupChance: 0.05,
    usualMaxTemperatureVariation: 0.2,
    flipDirectionChance: 0.05,
  },
  ['28ac73e7050000e6']: {
    probeId: '28ac73e7050000e6',
    chanceOfGettingRead: 0.98,
    hiccupChance: 0.05,
    usualMaxTemperatureVariation: 0.2,
    flipDirectionChance: 0.05,
  },
  ['randomstring']: {
    probeId: 'randomstring',
    chanceOfGettingRead: 0.02,
    hiccupChance: 0.05,
    usualMaxTemperatureVariation: 0.2,
    flipDirectionChance: 0.05,
  },
  ['Uááááááááááááá!!!']: {
    probeId: 'Uááááááááááááá!!!',
    chanceOfGettingRead: 0.02,
    hiccupChance: 0.05,
    usualMaxTemperatureVariation: 0.2,
    flipDirectionChance: 0.05,
  },
};

const getInitialProbeStates = (): ProbeStates => {
  return Object.values(probeInfos).reduce((states, probeInfo) => {
    const initialTemperature = getRandomNumberBetween(85, 90);
    states[probeInfo.probeId] = {
      temperature: initialTemperature,
      lastSeriousTemperature: initialTemperature,
      temperatureEvolutionDirection: flipCoin(0.5) ? 'up' : 'down',
    };

    return states;
  }, {} as ProbeStates);
};

const getOppositeDirection = (direction: 'up' | 'down'): 'up' | 'down' => (direction === 'up') ? 'down' : 'up';

const getNewDirection = (probeInfo: ProbeInfo, probeState: ProbeState): 'up' | 'down' => {
  const correctedFlipChance = ((): number => {
    const chanceModifier = probeState.temperatureEvolutionDirection === 'up' ? Math.max(probeState.lastSeriousTemperature - 90, 0) : Math.max(80 - probeState.lastSeriousTemperature, 0);
    const chance = Math.min(((1 - probeInfo.flipDirectionChance) / 10) * chanceModifier + probeInfo.flipDirectionChance, 1);

    return chance;
  })();

  return flipCoin(correctedFlipChance) ?
    getOppositeDirection(probeState.temperatureEvolutionDirection) : probeState.temperatureEvolutionDirection;
};

const getNextProbeState = (probeInfo: ProbeInfo, probeState: ProbeState): ProbeState => {
  if (flipCoin(probeInfo.hiccupChance)) { // Hiccup case
    return {
      ...probeState,
      temperature: getRandomNumberBetween(-2500, 600),
    };
  }
  // Serious reading
  const temperatureDelta = getRandomNumberBetween(0, probeInfo.usualMaxTemperatureVariation * 100) / 100;
  const newTemperature = probeState.temperatureEvolutionDirection === 'up' ?
    probeState.lastSeriousTemperature + temperatureDelta : probeState.lastSeriousTemperature - temperatureDelta;

  const newDirection = getNewDirection(probeInfo, probeState);

  return {
    ...probeState,
    temperature: newTemperature,
    lastSeriousTemperature: newTemperature,
    temperatureEvolutionDirection: newDirection,
  };
};

const probeStates = getInitialProbeStates();

const generateFakeTemperatureResponse = (): string => {
  const lines = Object.values(probeInfos).map(probe => {
    if (flipCoin(probe.chanceOfGettingRead)) {
      const newProbeState = getNextProbeState(probeInfos[probe.probeId], probeStates[probe.probeId]);
      probeStates[probe.probeId] = newProbeState;
      return `${probe.probeId} ${renderTemperature(newProbeState.temperature)}`;
    }

    return null;
  }).filter(Boolean);

  return lines.join('\n');
};

const main = async () => {
  const app = express();
  // Set up logging
  app.use(morgan('dev'));
  // Set up routing
  const router = express.Router();
  router.get('/', (_req, res) => {
    res.setHeader('Content-Type', 'application/text');

    if (flipCoin(0.01)) {
      res.status(500);
      res.end();
    }
    else {
      const response = generateFakeTemperatureResponse();

      log(response);

      res.end(response);
    }
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
