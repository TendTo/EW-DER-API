import { Contract, EventFilter } from "ethers";
import { Unit } from "src/constants";

/**
 * Scan a list of objects and return a couple of elements with the minimum and maximum values
 * of the property provided.
 *
 * @param array Array of objects
 * @param property Property to compare among the elements of the array
 * @param isLessThan Callback function to compare two elements of the array
 * @returns Tuple containing the objects with min and max properties
 */
export function getMinMax<T extends object>(
  arr: T[],
  prop: keyof T,
  isLessThan: (a: T[keyof T], b: T[keyof T]) => boolean = (a, b) => a < b,
): readonly [T, T] {
  if (arr.length === 0) {
    throw new Error("Array is empty");
  }
  let minT = arr[0];
  let maxT = arr[0];
  let min = arr[0][prop];
  let max = arr[0][prop];
  for (let i = 1; i < arr.length; i++) {
    if (isLessThan(arr[i][prop], min)) {
      min = arr[i][prop];
      minT = arr[i];
    }
    if (!isLessThan(arr[i][prop], max)) {
      max = arr[i][prop];
      maxT = arr[i];
    }
  }
  return [minT, maxT] as const;
}

/**
 * Range function similar to Python's range function.
 * Starts from 0 and goes up to but not including the stop value.
 *
 * @example range(10) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 *
 * @param stop upper limit (exclusive)
 */
export function range(stop: number): Generator<number, void, void>;
/**
 * Range function similar to Python's range function.
 * Starts from the start value (including) and goes up to the stop value (exlusive).
 *
 * @example range(0, 10) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 *
 * @param start starting value (including)
 * @param stop upper limit (exclusive)
 */
export function range(
  start: number,
  stop: number,
): Generator<number, void, void>;
/**
 * Range function similar to Python's range function.
 * Starts from the start value (including) and goes up to the stop value (exlusive).
 * Each step is the given value.
 *
 * @example range(0, 10, 2) // [0, 2, 4, 6, 8]
 *
 * @param start starting value (including)
 * @param stop upper limit (exclusive)
 * @param step step size
 */
export function range(
  start: number,
  stop: number,
  step: number,
): Generator<number, void, void>;
export function* range(
  start: number,
  stop?: number,
  step: number = 1,
): Generator<number, void, void> {
  const actualStart = stop !== undefined ? start : 0;
  const actualStop = stop ?? start;
  let x = actualStart - step;
  while (x < actualStop - step) yield (x += step);
}

/**
 * Convert the value of energy measured in {@link unit} in Wh.
 *
 * @param value energy value gathered from the meter
 * @param unit unit of the energy value
 * @returns energy value in Wh
 */
export function unitConverter(value: number, unit: Unit): number {
  switch (unit) {
    case Unit.Wh:
      return value;
    case Unit.kWh:
      return value * 1000;
    case Unit.MWh:
      return value * 1000000;
    case Unit.GWh:
      return value * 1000000000;
    default:
      throw new Error(`Unknown unit: ${unit}`);
  }
}
