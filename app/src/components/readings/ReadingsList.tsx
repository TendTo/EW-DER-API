import { Container } from "@mui/material";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartTypeRegistry,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
} from "chart.js";
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { Reading } from "../../models";
import { getRandomColor } from "../../utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type ChartDataType = { x: number; y: number; xLabel: string };
type ChartTooltipItem<T extends keyof ChartTypeRegistry, R = unknown> = TooltipItem<T> & {
  raw: R;
};
type ReadingListProps = {
  readings: Reading[][];
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
        title: (inputs: ChartTooltipItem<"line", ChartDataType>[]) =>
          inputs.map((input) => input.raw.xLabel),
      },
    },
  },
  scales: {
    x: {
      type: "linear",
      ticks: {
        callback: (time: number) => new Date(time).toLocaleString(navigator.language),
      },
    },
  },
};

export function ReadingList({ readings }: ReadingListProps) {
  const data = useMemo<ChartData<"line", ChartDataType[]>>(
    () => ({
      datasets: readings.map((reading, idx) => ({
        label: reading.find(() => true)?.assetDID ?? "AssetDID",
        data: reading.map((reading) => ({
          y: reading.volume,
          x: reading.unixTimestamp,
          xLabel: reading.timestamp.toLocaleString(navigator.language),
        })),
        borderColor: getRandomColor(idx),
        backgroundColor: getRandomColor(idx, 0.5),
      })),
    }),
    [readings],
  );
  return (
    <Container>
      <Line options={options as any} data={data} />
    </Container>
  );
}
