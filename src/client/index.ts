import { ChartData } from 'chart.js';
import Chart from 'chart.js/auto';
import { ViewModelClient } from '../types';
import { renderTime } from '../utils/generalUtils';


const getNewReadings = async () => await (await fetch('./readings.json')).json() as ViewModelClient;

const getChartData = (viewData: ViewModelClient): ChartData<'line', any, unknown> => {
  const {
    log: readings,
    probeInfos,
  } = viewData;
  return {
    labels: readings.map(reading => reading.timestamp).map(timestamp => new Date(timestamp)).map(renderTime),
    datasets: Object.keys(probeInfos).map(probeId => {
      return {
        label: probeInfos[probeId].probeName,
        fill: false,
        data: readings.map(reading => reading.item[probeId]?.temperature ?? null),
        tension: 0.1,
        borderColor: probeInfos[probeId].color,
      };
    }),
  };
};

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
