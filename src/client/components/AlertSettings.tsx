import { prettify } from '../../utils/generalUtils';
import { Inline } from './layout/Inline';

export interface IDelta {
  readonly timeMs: number;
  readonly temperatureDelta: number;
}

export interface AlertSettings {
  readonly min?: number;
  readonly max?: number;
  readonly rise?: IDelta;
  readonly decline?: IDelta;
}

export interface AlertSettingsProps {
  readonly onChange: (newAlertSettings: AlertSettings) => void;
  readonly settings: AlertSettings;
}

const phase1Alert: AlertSettings = {
  max: 30,
  rise: {
    temperatureDelta: 5,
    timeMs: 20 * 1000,
  },
};

const phase2Alert: AlertSettings = {
  max: 79,
};

const phase3Alert: AlertSettings = {
  max: 89.5,
  min: 85,
  decline: {
    temperatureDelta: .5,
    timeMs: 20 * 1000,
  },
};

export const AlertSettings: React.FC<AlertSettingsProps> = ({
  onChange,
  settings,
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
          {prettify(settings)}
        </span>
      </Inline>
    </div>
  );
};
