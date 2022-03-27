import { Unit } from "src/constants";
import { getMinMax, range, unitConverter } from ".";

describe("Utility functions", () => {
  it("getMinMax function", () => {
    const objects = [...Array(100).keys()].map((e) => ({ property: e }));

    const minMax = getMinMax(objects, "property");
    expect(minMax[0]).toEqual({ property: objects[0].property });
    expect(minMax[1]).toEqual({ property: objects[99].property });
  });

  it("range function: (stop)", () => {
    const stop = 10;
    const res = [...range(stop)];

    res.forEach((e, i) => expect(e).toEqual(i));
    expect(res.length).toEqual(stop);
  });

  it("range function: (start, stop)", () => {
    const start = 5,
      stop = 50;
    const res = [...range(start, stop)];

    res.forEach((e, i) => expect(e).toEqual(i + start));
    expect(res.length).toEqual(stop - start);
  });

  it("range function: (start, stop, step)", () => {
    const start = 5,
      stop = 7,
      step = 3;
    const res = [...range(start, stop, step)];

    res.forEach((e, i) => expect(e).toEqual(i * step + start));
    expect(res.length).toEqual(Math.ceil((stop - start) / step));
  });

  it("unitConverter Wh -> Wh", () => {
    const value = 1;
    const res = unitConverter(1, Unit.Wh);
    expect(res).toEqual(value);
  });

  it("unitConverter KWh -> Wh", () => {
    const value = 100;
    const res = unitConverter(1, Unit.kWh);
    expect(res).toEqual(value);
  });

  it("unitConverter MWh -> Wh", () => {
    const value = 100000;
    const res = unitConverter(1, Unit.MWh);
    expect(res).toEqual(value);
  });

  it("unitConverter GWh -> Wh", () => {
    const value = 100000000;
    const res = unitConverter(1, Unit.GWh);
    expect(res).toEqual(value);
  });
});
