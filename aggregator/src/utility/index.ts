import { Matches } from "class-validator";

export function IsInfluxTime() {
  return Matches(
    /^(?:-(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)$/,
    {
      message:
        "Invalid format. Expected a negative duration or a date-string. Check https://docs.influxdata.com/flux/v0.x/data-types/basic/duration/#duration-syntax",
    },
  );
}

export function IsInfluxDuration() {
  return Matches(
    /^(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)$/,
    {
      message:
        "Invalid format. Expected a duration. Check https://docs.influxdata.com/flux/v0.x/data-types/basic/duration/#duration-syntax",
    },
  );
}

export function GetUnixTimeFromTimestamp(timestamp: string) {
  return new Date(timestamp).getTime();
}
