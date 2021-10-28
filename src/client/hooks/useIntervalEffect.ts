import {
  DependencyList,
  useEffect,
} from 'react';

export const useIntervalEffect = (effect: () => void, deps: DependencyList, intervalTimeMs: number) => {
  useEffect(() => {
    effect();
    const interval = setInterval(effect, intervalTimeMs);

    return () => {
      clearInterval(interval);
    };
  }, deps);
};
