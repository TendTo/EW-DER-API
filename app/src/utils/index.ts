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

type TranslationFunction = (key: string, options?: Record<string, any>) => string;

type ValidationKeys = "DID" | "TIME" | "TIME_OR_NOW" | "INTERVAL";

/**
 * Create a translate validation for a regex pattern
 * @param key used to chose the type of validation to create
 * @param t translation function
 * @returns validation object
 */
export function getRegexValidation(key: ValidationKeys, t: TranslationFunction) {
  switch (key) {
    case "DID":
      return {
        value: /^did:ethr:0x[0-9a-fA-F]{40}$/,
        message: t("ASSET.FORM.VALIDATION.DID"),
      };
    case "TIME":
      return {
        value:
          /^(?:-(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z)$/,
        message: t("ASSET.FORM.VALIDATION.TIME"),
      };
    case "TIME_OR_NOW":
      return {
        value:
          /^(?:-(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z|now\(\))$/,
        message: t("ASSET.FORM.VALIDATION.TIME"),
      };
    case "INTERVAL":
      return {
        value: /^(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)$/,
        message: t("ASSET.FORM.VALIDATION.INTERVAL"),
      };
    default:
      return {
        value: /.+/,
        message: "",
      };
  }
}

type GetMinMaxValidationReturn = {
  value: number;
  message: string;
};

/**
 * Create a translate validation for a max or min value
 * @param param0 object containing a "min" or "max" property
 * @param t translation function
 * @returns validation object
 */
export function getMinMaxValidation(
  { min }: { min: number },
  t: TranslationFunction,
): GetMinMaxValidationReturn;
export function getMinMaxValidation(
  { max }: { max: number },
  t: TranslationFunction,
): GetMinMaxValidationReturn;
export function getMinMaxValidation(
  { min, max }: { min?: number; max?: number },
  t: TranslationFunction,
) {
  return {
    value: min ?? max,
    message:
      min === undefined
        ? t("GENERAL.FORM.VALIDATION.MAX", { max })
        : t("GENERAL.FORM.VALIDATION.MIN", { min }),
  };
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
