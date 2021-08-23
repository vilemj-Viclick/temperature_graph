import { ChartData } from 'chart.js';
import Chart from 'chart.js/auto';
import {
  ITemperatureReading,
  LogJson,
} from '../types';
import {
  getFirst,
  renderTime,
} from '../utils/utils';

const probeMapping = {
  '28ac73e7050000e6': {
    probeName: 'Plášť',
    color: 'rgb(75, 192, 192)',
  },
  '28c04bdc060000da': {
    probeName: 'Medium',
    color: 'rgb(48, 137, 34)',
  },
};

const getNewReadings = async () => await (await fetch('./readings.json')).json() as LogJson<ITemperatureReading>;

const getChartData = (readings: LogJson<ITemperatureReading>):ChartData<'line', any, unknown> => {
  return {
    labels: readings.map(reading => reading.timestamp).map(timestamp => new Date(timestamp)).map(renderTime),
    datasets: Object.keys(getFirst(readings)?.item ?? {}).map(probeId => {
      return {
        label: probeMapping[probeId].probeName,
        fill: false,
        data: readings.map(reading => reading.item[probeId].temperature),
        tension: 0.1,
        borderColor: probeMapping[probeId].color,
      };
    }),
  }
}

const main = async () => {
  const readings = await getNewReadings();
  console.log(readings);

  const chart = new Chart(document.getElementById('chart') as HTMLCanvasElement, {
    type: 'line',
    options: {
      scales: {
        y: {
          // beginAtZero: true
        },
      },
    },
    data: getChartData(readings),
  });

  setInterval(async () => {
    chart.data = getChartData(await getNewReadings());
    chart.update('none');
  }, 5000);
};

main();
