import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export function AggregatorHome() {
  const { t } = useTranslation();
  return (
    <Card variant="outlined">
      <CardHeader title={t("GENERAL.AGGREGATOR")} />
      <CardContent>
        <Typography>{t("AGGREGATOR.HOME")}</Typography>
      </CardContent>
    </Card>
  );
}
