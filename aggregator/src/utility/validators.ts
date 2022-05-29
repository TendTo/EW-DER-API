import {
  Matches,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { DurationUnit } from "../constants";

@ValidatorConstraint({ name: "isBefore", async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return this.getTime(propertyValue) < this.getTime(args.object[args.constraints[0]]);
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be before "${args.constraints[0]}"`;
  }

  private getTime(propertyValue: string): number {
    if (propertyValue === "now()") return Date.now();
    if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z/.test(propertyValue))
      return new Date(propertyValue).getTime();
    return this.getTimeValueFromDuration(propertyValue);
  }

  private getTimeValueFromDuration(propertyValue: string): number {
    const dutaions = propertyValue
      .replace("-", "")
      .matchAll(/\d+(ns|us|ms|mo|s|h|d|w|y|m)/g);
    let acc = 0;
    for (const duration of dutaions) {
      const value = parseInt(duration[0].match(/\d+/g)[0]);
      const mult = duration[0].match(/[a-zA-Z]+/g)[0] as DurationUnit;
      acc += value * this.getMultiplyDuration(mult);
    }
    acc = propertyValue.includes("-") ? -acc : acc;
    return Date.now() + acc;
  }

  private getMultiplyDuration(duration: DurationUnit): number {
    switch (duration) {
      case "us":
        return 0.001;
      case "ms":
        return 1;
      case "mo":
        return 60 * 60 * 24 * 30;
      case "s":
        return 1000;
      case "h":
        return 60 * 60 * 1000;
      case "d":
        return 24 * 60 * 60 * 1000;
      case "w":
        return 7 * 24 * 60 * 60 * 1000;
      case "y":
        return 365 * 24 * 60 * 60 * 1000;
      case "m":
        return 30 * 24 * 60 * 60 * 1000;
      default:
        return 0;
    }
  }
}

export function IsInfluxTime(validationOptions?: ValidationOptions) {
  return Matches(
    /^(?:-(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z|now\(\))$/,
    {
      message:
        "Invalid format. Expected a negative duration or a date-string. Check https://docs.influxdata.com/flux/v0.x/data-types/basic/duration/#duration-syntax",
      ...validationOptions,
    },
  );
}

export function IsInfluxDuration(validationOptions?: ValidationOptions) {
  return Matches(/^(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)$/, {
    message:
      "Invalid format. Expected a duration. Check https://docs.influxdata.com/flux/v0.x/data-types/basic/duration/#duration-syntax",
    ...validationOptions,
  });
}

export function IsDID(validationOptions?: ValidationOptions) {
  return Matches(/^did:ethr:0x[0-9a-fA-F]{40}$/, {
    message:
      "Invalid format. Expected a DID. Check https://github.com/uport-project/ethr-did#did-method",
    ...validationOptions,
  });
}
