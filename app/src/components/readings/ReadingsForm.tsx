import { Send } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Grid } from "@mui/material";
import { useEthers } from "@usedapp/core";
import { useCallback, useEffect } from "react";
import {
  CheckboxButtonGroup,
  FormContainer,
  TextFieldElement,
} from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { useGetAssets } from "../../hooks";
import { ReadingsDTOOptions } from "../../models";

export type ReadingsFormValuesType = ReadingsDTOOptions & {
  assetDID: string[];
};
type ReadingsFormProps = {
  onSuccess: (values: ReadingsFormValuesType) => void;
};

export const defaultValues: ReadingsFormValuesType = {
  assetDID: [],
  limit: 10,
  start: "-1d",
  stop: new Date().toISOString().split(".")[0] + "Z",
  offset: 0,
  order: "ASC",
};

export function ReadingsForm({ onSuccess }: ReadingsFormProps) {
  const { t } = useTranslation();
  const { account } = useEthers();
  const { value, execute } = useGetAssets();

  const DIDValidation = {
    value: /^did:ethr:0x[0-9a-fA-F]{40}$/,
    message: t("ASSET.FORM.VALIDATION.DID"),
  };
  const timeValidationRegex = {
    value:
      /^(?:-(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)$/,
    message: t("ASSET.FORM.VALIDATION.TIME"),
  };

  const onSuccessHandler = useCallback(
    (values: ReadingsFormValuesType) => {
      const { limit = "", offset = "", stop = "" } = values;
      onSuccess({
        ...values,
        limit: limit === "" ? undefined : Number(limit),
        offset: offset === "" ? undefined : Number(offset),
        stop: stop === "" ? new Date().toISOString().split(".")[0] + "Z" : stop,
      });
    },
    [onSuccess],
  );

  useEffect(() => {
    if (account) {
      execute([account]);
    }
  }, [account, execute]);

  return (
    <Card variant="outlined">
      <CardHeader title={t("ASSET.FORM.FORM_TITLE")} />
      <CardContent>
        <FormContainer defaultValues={defaultValues} onSuccess={onSuccessHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {value && value.length > 0 ? (
                <CheckboxButtonGroup
                  label={t("ASSET.FORM.ASSET_OWNED")}
                  name="assetDID"
                  options={value.map(({ asset }) => ({
                    id: `did:ethr:${asset}`,
                    label: `did:ethr:${asset}`,
                  }))}
                />
              ) : (
                <TextFieldElement
                  fullWidth
                  name="assetDID"
                  label={t("ASSET.FORM.ASSET_DID")}
                  required
                  validation={{ pattern: DIDValidation }}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <TextFieldElement
                fullWidth
                name="start"
                label={t("ASSET.FORM.START")}
                validation={{
                  pattern: timeValidationRegex,
                  required: { message: t("ASSET.FORM.VALIDATION.REQUIRED"), value: true },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldElement
                fullWidth
                name="stop"
                label={t("ASSET.FORM.STOP")}
                validation={{ pattern: timeValidationRegex }}
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
