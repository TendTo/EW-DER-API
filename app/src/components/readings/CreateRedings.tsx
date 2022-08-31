import { Send } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Grid } from "@mui/material";
import { useCallback } from "react";
import { FormContainer, SelectElement, TextFieldElement } from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { useSendReadings } from "../../hooks/useSendReadings";
import { Asset, ReducedReadingDTO } from "../../models";
import {
  getMinMaxValidation,
  getRegexValidation,
  parseCreateReadingsFormValues,
} from "../../utils";

type CreateReadingsProps = {
  assets: Asset[];
};

export type CreateReadingsFormValuesType = {
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

export function CreateReadings({ assets }: CreateReadingsProps) {
  const { t } = useTranslation();
  const sendReadings = useSendReadings();

  const onSuccessHandler = useCallback(
    (values: CreateReadingsFormValuesType) => {
      const { assetDID, interval, maxValue, minValue, nReadings, start } =
        parseCreateReadingsFormValues(values);
      const readings: ReducedReadingDTO[] = [];
      const startTime = new Date(start).getTime();
      for (let i = 0; i < nReadings; i++) {
        readings.push({
          assetDID: assetDID,
          value: Math.floor(Math.random() * (maxValue - minValue)) + minValue,
          timestamp: new Date(startTime + i * interval * 1000).toISOString(),
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
              <SelectElement
                fullWidth
                name="assetDID"
                label={t("ASSET.FORM.ASSET_DID")}
                options={assets.map(({ singleValue }) => ({
                  id: singleValue,
                  title: singleValue,
                }))}
                validation={{
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
                name="interval"
                label={t("READINGS.FORM.INTERVAL")}
                validation={{
                  pattern: getRegexValidation("INTEGER", t),
                  min: getMinMaxValidation({ min: 1 }, t),
                  max: getMinMaxValidation({ max: 200 }, t),
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextFieldElement
                fullWidth
                name="nReadings"
                label={t("READINGS.FORM.N_READINGS")}
                validation={{
                  pattern: getRegexValidation("INTEGER", t),
                  min: getMinMaxValidation({ min: 30 }, t),
                  max: getMinMaxValidation({ max: 200 }, t),
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextFieldElement
                fullWidth
                name="minValue"
                label={t("READINGS.FORM.MIN_VALUE")}
                validation={{
                  pattern: getRegexValidation("NUMBER", t),
                  min: getMinMaxValidation({ min: 1 }, t),
                  max: getMinMaxValidation({ max: 100000 }, t),
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextFieldElement
                fullWidth
                name="maxValue"
                label={t("READINGS.FORM.MAX_VALUE")}
                validation={{
                  pattern: getRegexValidation("NUMBER", t),
                  min: getMinMaxValidation({ min: 1 }, t),
                  max: getMinMaxValidation({ max: 100000 }, t),
                }}
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
