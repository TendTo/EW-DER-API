import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export function ProsumerHome() {
  const { t } = useTranslation();
  return (
    <Card variant="outlined">
      <CardHeader title={t("GENERAL.PROSUMER")} />
      <CardContent>
        <Typography>{t("PROSUMER.HOME")}</Typography>
      </CardContent>
    </Card>
  );
}
