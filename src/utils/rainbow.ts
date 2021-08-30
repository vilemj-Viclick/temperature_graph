const rgb2string = (r: number, g: number, b: number): string => {
  return `rgb(${[r, g, b].map(n => Math.round(n * 255)).join(', ')})`;
};

const redHue = 0;
const greenHue = 8;
const blueHue = 4;

const getCoordinate = (start: number, hueFloat: number) => {
  const hue = (start + (hueFloat * 12)) % 12;
  return 0.5 - (0.5 * Math.max(Math.min(hue - 3, 9 - hue, 1), -1));
};

export const rainbowStop = (hueFloat: number) => {
  return rgb2string(getCoordinate(redHue, hueFloat), getCoordinate(greenHue, hueFloat), getCoordinate(blueHue, hueFloat));
};


export const getRainbow = (numberOfColors: number) => {
  return Array(numberOfColors).fill(0).map((_, index) => {
    return rainbowStop(index / numberOfColors);
  });
};
