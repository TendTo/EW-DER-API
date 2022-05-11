import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Reading } from "../models";

type ReadingListProps = {
  data: Reading[];
};

const dataTemp = [
  new Reading(
    "did:ethr:0xff0B184697827882560e08C7AA35531aEEc76aBF",
    "0x1",
    "0x1",
    1,
    new Date("2020-01-01T00:00:00.000Z"),
  ),
  new Reading(
    "did:ethr:0xff0B184697827882560e08C7AA35531aEEc76aBF",
    "0x1",
    "0x1",
    2,
    new Date("2020-01-02T00:00:00.000Z"),
  ),
  new Reading(
    "did:ethr:0xff0B184697827882560e08C7AA35531aEEc76aBF",
    "0x1",
    "0x1",
    3,
    new Date("2020-01-03T00:00:00.000Z"),
  ),
];

const dataLib = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export function ReadingList({ data }: ReadingListProps) {
  console.log(data);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={dataTemp}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}