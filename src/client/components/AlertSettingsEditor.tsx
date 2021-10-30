import React from 'react';
import styled from 'styled-components';
import { IProbeInfoDictionary } from '../../types';
import { Inline } from './layout/Inline';
import {
  AlertSettings,
  ProbeResults,
} from './types';

export interface AlertSettingsProps {
  readonly onChange: (newAlertSettings: AlertSettings) => void;
  readonly settings: AlertSettings;
  readonly probeResults: ProbeResults;
  readonly probeInfos: IProbeInfoDictionary;
}

const phase1Alert: AlertSettings = {
  '28ac73e7050000e6': {
    max: 30,
    rise: {
      temperatureDelta: 5,
      timeMs: 20 * 1000,
    },
  },
};

const phase2Alert: AlertSettings = {
  '28ac73e7050000e6': {
    max: 79,
  },
};

const phase3Alert: AlertSettings = {
  '28ac73e7050000e6': {
    max: 89.5,
    min: 85,
    decline: {
      temperatureDelta: .5,
      timeMs: 20 * 1000,
    },
  },
};

const ColoredSpan = styled.span<{ readonly alert: boolean }>`
    background: ${({ alert }) => alert ? 'red' : 'transparent'};
`;

export const AlertSettingsEditor: React.FC<AlertSettingsProps> = ({
  onChange,
  settings,
  probeResults,
  probeInfos,
}) => {
  return (
    <div
      css={`
          width: 100%;
      `}
    >
      <Inline spacing={16}>
        <button onClick={() => onChange(phase1Alert)}>
          Fáze zahřívání
        </button>
        <button onClick={() => onChange(phase2Alert)}>
          Fáze sběru odpadu
        </button>
        <button onClick={() => onChange(phase3Alert)}>
          Fáze destilace
        </button>
        <span>
          {Object.keys(settings).map(probeId => {
            const probeSettings = settings[probeId];
            const probeResult = probeResults[probeId];
            const probeInfo = probeInfos[probeId];

            return (
              <Inline
                key={probeId}
                spacing={8}
              >
                <strong>{probeInfo?.probeName ?? probeId}:</strong>
                {probeSettings?.max && (
                  <ColoredSpan alert={probeResult?.max ?? false}>Max: {probeSettings.max}°C</ColoredSpan>
                )}
                {probeSettings?.min && (
                  <ColoredSpan alert={probeResult?.min ?? false}>Min: {probeSettings.min}°C</ColoredSpan>
                )}
              </Inline>
            );
          })}
        </span>
      </Inline>
    </div>
  );
};
