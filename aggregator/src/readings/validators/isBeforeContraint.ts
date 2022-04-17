import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { DurationUnit } from "../../constants";

@ValidatorConstraint({ name: "isBefore", async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return this.getTime(propertyValue) < this.getTime(args.object[args.constraints[0]]);
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be before "${args.constraints[0]}"`;
  }

  private getTime(propertyValue: string) {
    return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/.test(propertyValue)
      ? new Date(propertyValue).getTime()
      : this.getTimeValueFromDuration(propertyValue);
  }

  private getTimeValueFromDuration(propertyValue: string) {
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

  private getMultiplyDuration(duration: DurationUnit) {
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
