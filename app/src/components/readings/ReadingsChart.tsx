import { Alert, AlertTitle, Container } from "@mui/material";
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
import { useTranslation } from "react-i18next";
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

type Source = "assetDID" | "rootHash";
type ChartDataType = { x: number; y: number; xLabel: string };
type ChartTooltipItem<T extends keyof ChartTypeRegistry, R = unknown> = TooltipItem<T> & {
  raw: R;
};
type ReadingListProps = {
  source: Source;
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

function getChartTitle(readings: Reading[], source: Source) {
  const reading = readings.find(() => true);
  const defaultLabel = source === "rootHash" ? "Precise Proof" : "AssetDID";
  if (!reading) return defaultLabel;
  return reading[source] ?? defaultLabel;
}

export function ReadingsChart({ readings, source }: ReadingListProps) {
  const { t } = useTranslation();

  const data = useMemo<ChartData<"line", ChartDataType[]>>(
    () => ({
      datasets: readings.map((reading, idx) => ({
        label: getChartTitle(reading, source),
        data: reading.map((reading) => ({
          y: reading.volume,
          x: reading.unixTimestamp,
          xLabel: reading.timestamp.toLocaleString(navigator.language),
        })),
        borderColor: getRandomColor(idx),
        backgroundColor: getRandomColor(idx, 0.5),
      })),
    }),
    [readings, source],
  );
  return (
    <Container sx={{ marginTop: 2 }}>
      {readings.length > 0 ? (
        <Line options={options as any} data={data} />
      ) : (
        <Alert severity="info">
          <AlertTitle>{t("GENERAL.INFO")}</AlertTitle>
          {t("ASSET.FORM.NO_READINGS")}
        </Alert>
      )}
    </Container>
  );
}
