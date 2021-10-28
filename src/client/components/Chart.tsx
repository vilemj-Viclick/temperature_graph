import { ChartData } from 'chart.js';
import ChartRenderer from 'chart.js/auto';
import React, {
  useEffect,
  useRef,
} from 'react';
import { ViewModelClient } from '../../types';
import { renderTime } from '../../utils/generalUtils';
import { once } from '../../utils/once';

interface ChartProps {
  readonly readings: ViewModelClient;
}

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

const renderChart = (readings: ViewModelClient) => {
  const chart = new ChartRenderer(document.getElementById('chart') as HTMLCanvasElement, {
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

  return chart;
};

const renderChartOnce = once(renderChart);

export const Chart: React.FC<ChartProps> = ({ readings }) => {
  const chartRef = useRef(renderChartOnce(readings));


  useEffect(() => {
    if (readings && chartRef.current) {
      chartRef.current.data = getChartData(readings);
      chartRef.current.update('none');
    }
  }, [readings]);

  return null;
};
