import { Send } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Grid } from "@mui/material";
import { useCallback } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { useSendReadings } from "../../hooks/useSendReadings";
import { ReducedReadingDTO } from "../../models";
import { getRegexValidation } from "../../utils";

type CreateReadingsFormValuesType = {
  assetDID: string;
  start: string;
  interval: number;
  nReadings: number;
  minValue: number;
  maxValue: number;
};

const defaultValues: CreateReadingsFormValuesType = {
  assetDID: "",
  start: new Date().toISOString(),
  interval: 10,
  nReadings: 50,
  minValue: 10,
  maxValue: 1000,
};

export function CreateReadings() {
  const { t } = useTranslation();
  const sendReadings = useSendReadings();

  const onSuccessHandler = useCallback(
    (values: CreateReadingsFormValuesType) => {
      const readings: ReducedReadingDTO[] = [];
      const startTime = new Date(values.start).getTime();
      for (let i = 0; i < values.nReadings; i++) {
        readings.push({
          assetDID: values.assetDID,
          value:
            Math.floor(Math.random() * (values.maxValue - values.minValue)) +
            values.minValue,
          timestamp: new Date(startTime + i * values.interval * 1000).toISOString(),
        });
      }
      sendReadings(readings);
    },
    [sendReadings],
  );

  return (
    <Card variant="outlined">
      <CardHeader title={t("READINGS.FORM.FORM_TITLE")} />
      <CardContent>
        <FormContainer defaultValues={defaultValues} onSuccess={onSuccessHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextFieldElement
                fullWidth
                name="assetDID"
                label={t("ASSET.FORM.ASSET_DID")}
                validation={{
                  pattern: getRegexValidation("DID", t),
                  required: { message: t("ASSET.FORM.VALIDATION.REQUIRED"), value: true },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldElement
                fullWidth
                name="start"
                label={t("ASSET.FORM.START")}
                validation={{
                  pattern: getRegexValidation("TIME", t),
                  required: { message: t("ASSET.FORM.VALIDATION.REQUIRED"), value: true },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldElement
                fullWidth
                type="number"
                name="interval"
                label={t("READINGS.FORM.INTERVAL")}
                validation={{ min: 1, max: 200, pattern: /^\d+$/ }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextFieldElement
                fullWidth
                type="number"
                name="nReadings"
                label={t("READINGS.FORM.N_READINGS")}
                validation={{ min: 1, max: 200, pattern: /^\d+$/ }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextFieldElement
                fullWidth
                type="number"
                name="minValue"
                label={t("READINGS.FORM.MIN_VALUE")}
                validation={{ min: 1, max: 10000, pattern: /^\d+$/ }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextFieldElement
                fullWidth
                type="number"
                name="maxValue"
                label={t("READINGS.FORM.MAX_VALUE")}
                validation={{ min: 1, max: 10000, pattern: /^\d+$/ }}
              />
            </Grid>
            <Grid item xs={8}></Grid>
            <Grid item xs={4} justifyContent="flex-end" container>
              <Button type={"submit"} variant="contained" endIcon={<Send />}>
                {t("GENERAL.SUBMIT")}
              </Button>
            </Grid>
          </Grid>
        </FormContainer>
      </CardContent>
    </Card>
  );
}
