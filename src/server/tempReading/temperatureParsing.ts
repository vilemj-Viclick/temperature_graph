import {
  ITemperatureReading,
  ITemperatureWithProbeId,
} from '../../types';

export const parseReading = (text: string): ITemperatureReading => {
  const probeInfoTexts = text.split('\n');
  const probeInfoTuples = probeInfoTexts.map(probeInfoText => probeInfoText.split(' '));
  const probeInfos = probeInfoTuples.map(probeInfoTuple => {
    const probeInfo: ITemperatureWithProbeId = {
      probeId: probeInfoTuple[0],
      temperature: parseFloat(probeInfoTuple[1]),
    };
    return probeInfo;
  });
  return probeInfos.reduce((result, probeInfo) => {
    if (probeInfo.probeId) {
      result[probeInfo.probeId] = probeInfo;
    }
    return result;
  }, {});
};
