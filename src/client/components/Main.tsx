import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ViewModelClient } from '../../types';
import { AlertSettings } from './AlertSettings';
import { Chart } from './Chart';
import { useIntervalEffect } from '../hooks/useIntervalEffect';

const getNewReadings = async () => await (await fetch('./readings.json')).json() as ViewModelClient;


const Main: React.FC = () => {
  const [readings, setReadings] = useState<ViewModelClient>({
    log: [],
    probeInfos: {},
  });
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({});

  useIntervalEffect(async () => {
    setReadings(await getNewReadings());
  }, [], 5000);

  return (
    <>
      <Chart readings={readings} />
      <AlertSettings
        onChange={setAlertSettings}
        settings={alertSettings}
      />
    </>
  );
};


export const initializeReactApp = () => {
  ReactDOM.render(<Main />, document.getElementById('react-root'));
};
