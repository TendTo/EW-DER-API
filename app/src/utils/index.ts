const CHART_COLORS = [
  "rgb(255, 99, 132, alpha)",
  "rgb(255, 159, 64, alpha)",
  "rgb(255, 205, 86, alpha)",
  "rgb(75, 192, 192, alpha)",
  "rgb(54, 162, 235, alpha)",
  "rgb(153, 102, 255, alpha)",
  "rgb(201, 203, 207, alpha)",
];
const MAX_BRIGHTNESS = 230;

/**
 * Generate a random color
 * @param idx index of the color from the CHART_COLORS array
 * @param alpha alpha value for the color
 * @returns random color with the given alpha value
 */
export function getRandomColor(idx?: number, alpha: number = 1) {
  if (idx === undefined || idx >= CHART_COLORS.length || idx < 0) {
    const colorComponent = () => Math.floor(Math.random() * MAX_BRIGHTNESS);
    return `rgb(${colorComponent()}, ${colorComponent()}, ${colorComponent()}, ${alpha})`;
  }
  return CHART_COLORS[idx].replace("alpha", `${alpha}`);
}
