import { Search } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
} from "@mui/material";
import { useCallback, useMemo } from "react";
import {
  FormContainer,
  MultiSelectElement,
  RadioButtonGroup,
  SwitchElement,
  TextFieldElement,
} from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { AsyncState } from "../../hooks";
import {
  AggregatedReadingsDTOOptions,
  aggregationFunctions,
  Asset,
  RootHash,
} from "../../models";
import { getRegexValidation } from "../../utils";

export type AggregatedReadingsFormValuesType = AggregatedReadingsDTOOptions & {
  assetDID?: string[];
  rootHash?: string[];
};
type Source = "assetDID" | "rootHash";
type AggregatedReadingsFormProps<T extends Source> = {
  source: T;
  assets: (T extends "assetDID" ? Asset[] : RootHash[]) | null;
  onSuccess: (values: AggregatedReadingsFormValuesType) => void;
  status: AsyncState;
};

const defaultValues: AggregatedReadingsFormValuesType = {
  assetDID: [],
  rootHash: [],
  limit: 10,
  start: "-1d",
  stop: "now()",
  offset: 0,
  order: "ASC",
  difference: false,
  aggregationFunction: "mean",
  aggregationWindow: "5m",
};

export function AggregatedReadingsForm<T extends Source>({
  onSuccess,
  assets,
  source,
  status,
}: AggregatedReadingsFormProps<T>) {
  const { t } = useTranslation();

  const onSuccessHandler = useCallback(
    (values: AggregatedReadingsFormValuesType) => {
      const { limit = "", offset = "", stop = "" } = values;
      onSuccess({
        ...values,
        limit: limit === "" ? undefined : Number(limit),
        offset: offset === "" ? undefined : Number(offset),
        stop: stop === "" ? new Date().toISOString().split(".")[0] + "Z" : stop,
        ...(source === "assetDID" ? { rootHash: undefined } : { assetDID: undefined }),
      });
    },
    [onSuccess, source],
  );

  const selectElement = useMemo(() => {
    if (!assets || assets.length === 0)
      return (
        <Alert severity="warning">
          <AlertTitle>{t("GENERAL.WARNING")}</AlertTitle>
          {t("ASSET.FORM.NO_ASSETS")}{" "}
        </Alert>
      );
    return source === "assetDID" ? (
      <MultiSelectElement
        key="assetDID"
        label={t("ASSET.FORM.ASSET_OWNED")}
        menuItems={assets.map(({ singleValue: value }) => value)}
        name="assetDID"
        showChips
        fullWidth
        validation={{
          required: {
            message: t("ASSET.FORM.VALIDATION.REQUIRED"),
            value: true,
          },
        }}
      />
    ) : (
      <MultiSelectElement
        key="rootHash"
        label={t("ASSET.FORM.ROOT_HASH_PRODUCED")}
        menuItems={assets.map(({ singleValue: value }) => value)}
        name="rootHash"
        showChips
        fullWidth
        validation={{
          required: {
            message: t("ASSET.FORM.VALIDATION.REQUIRED"),
            value: true,
          },
        }}
      />
    );
  }, [assets, t, source]);

  return (
    <Card variant="outlined">
      <CardHeader title={t("ASSET.FORM.FORM_TITLE")} />
      <CardContent>
        <FormContainer defaultValues={defaultValues} onSuccess={onSuccessHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {selectElement}
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
                name="stop"
                label={t("ASSET.FORM.STOP")}
                validation={{ pattern: getRegexValidation("TIME_OR_NOW", t) }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldElement
                fullWidth
                type="number"
                name="limit"
                label={t("ASSET.FORM.LIMIT")}
                validation={{ min: 1, max: 200, pattern: /^\d+$/ }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldElement
                fullWidth
                type="number"
                name="offset"
                label={t("ASSET.FORM.OFFSET")}
                validation={{ min: 0, max: 200, pattern: /^\d+$/ }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldElement
                fullWidth
                name="aggregationWindow"
                label={t("ASSET.FORM.AGGREGATIO_WINDOW")}
                validation={{ pattern: getRegexValidation("INTERVAL", t) }}
              />
            </Grid>
            <Grid item xs={6}>
              <SwitchElement label={t("ASSET.FORM.DIFFERENCE")} name="difference" />
            </Grid>
            <Grid item xs={12}>
              <RadioButtonGroup
                label={t("ASSET.FORM.AGGREGATION_FUNCTION")}
                name="aggregationFunction"
                options={aggregationFunctions.map((func) => ({
                  id: func,
                  label: t(`ASSET.FORM.AGGRETATION_FUNCTION.${func.toUpperCase()}`),
                }))}
                row
              />
            </Grid>
            <Grid item xs={8}></Grid>
            <Grid item xs={4} justifyContent="flex-end" container>
              <Button
                type={"submit"}
                variant="contained"
                startIcon={<Search />}
                disabled={status === "pending"}
              >
                {t("GENERAL.SEARCH")}
              </Button>
            </Grid>
          </Grid>
        </FormContainer>
      </CardContent>
    </Card>
  );
}
