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

type ValidationKeys = "DID" | "TIME" | "INTERVAL";

export function getRegexValidation(key: ValidationKeys, t: (key: string) => string) {
  switch (key) {
    case "DID":
      return {
        value: /^did:ethr:0x[0-9a-fA-F]{40}$/,
        message: t("ASSET.FORM.VALIDATION.DID"),
      };
    case "TIME":
      return {
        value:
          /^(?:-(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)$/,
        message: t("ASSET.FORM.VALIDATION.TIME"),
      };
    case "INTERVAL":
      return {
        value:
          /^(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)$/,
        message: t("ASSET.FORM.VALIDATION.INTERVAL"),
      };
    default:
      return {
        value: /.+/,
        message: "",
      };
  }
}

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

/**
 * Convert a date object to a string with the format "yyyy-MM-ddTHH:mm:ssZ"
 * @param date date to convert
 * @returns time string expected by the backend
 */
export function formatDate(date: Date = new Date()) {
  return date.toISOString().split(".")[0] + "Z";
}
