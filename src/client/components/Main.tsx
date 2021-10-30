import React, {
  useEffect,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { ViewModelClient } from '../../types';
import { useIntervalEffect } from '../hooks/useIntervalEffect';
import { AlertSettingsEditor } from './AlertSettingsEditor';
import { AlertSettingsInterpreter } from './AlertSettingsInterpreter';
import { AlertSoundPlayer } from './AlertSoundPlayer';
import { Chart } from './Chart';
import {
  AlertSettings,
  ProbeResults,
} from './types';
import { VisualAlert } from './VisualAlert';

const getNewReadings = async () => await (await fetch('/readings.json')).json() as ViewModelClient;

const Main: React.FC = () => {
  const [readings, setReadings] = useState<ViewModelClient>({
    log: [],
    probeInfos: {},
  });
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({});
  const [areConstraintsViolated, setConstraintsViolated] = useState<boolean>(false);
  const [isAlertActivated, setIsAlertActivated] = useState<boolean>(true);
  const [probeResults, setProbeResults] = useState<ProbeResults>({});

  useIntervalEffect(async () => {
    setReadings(await getNewReadings());
  }, [], 5000);

  useEffect(() => {
    const cancelAlertSound = (event: MouseEvent) => {
      // @ts-ignore
      if (event.target.tagName.toLowerCase() !== 'button') {
        setIsAlertActivated(false);
      }
    };
    document.addEventListener('click', cancelAlertSound);

    return () => document.removeEventListener('click', cancelAlertSound);
  }, []);

  useEffect(() => {
    if (!areConstraintsViolated) {
      setIsAlertActivated(true);
    }
  }, [areConstraintsViolated]);

  const runAlert = isAlertActivated && areConstraintsViolated;

  return (
    <>
      <Chart readings={readings} />
      <AlertSettingsEditor
        onChange={setAlertSettings}
        settings={alertSettings}
        probeInfos={readings.probeInfos}
        probeResults={probeResults}
      />
      <AlertSettingsInterpreter
        readings={readings}
        alertSettings={alertSettings}
        onChange={(isTriggered, probeResults) => {
          setConstraintsViolated(isTriggered);
          setProbeResults(probeResults);
        }}
      />
      <VisualAlert triggered={runAlert} />
      <AlertSoundPlayer play={runAlert} />
    </>
  );
};


export const initializeReactApp = () => {
  ReactDOM.render(<Main />, document.getElementById('react-root'));
};
