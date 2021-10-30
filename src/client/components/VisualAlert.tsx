import React, {
  useState,
} from 'react';
import { useIntervalEffect } from '../hooks/useIntervalEffect';

interface VisualAlertProps {
  readonly triggered: boolean;
}

export const VisualAlert: React.FC<VisualAlertProps> = ({ triggered }) => {
  const [flip, setFlip] = useState<boolean>(false);

  useIntervalEffect(() => {
    if (triggered) {
      setFlip(f => !f);
    }
    else {
      setFlip(false);
    }
  }, [triggered], 500);

  return (
    <style>
      {`
        body {
          filter: invert(${flip ? '100%' : '0%'});
        }
        
        #root {
          background: white;
        }
      `}
    </style>
  );
};
