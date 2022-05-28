import { Send } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Grid } from "@mui/material";
import { FormContainer, RadioButtonGroup, TextFieldElement } from "react-hook-form-mui";
import { useTranslation } from "react-i18next";
import { aggregationFunctions, AssetMatchQueryOptions } from "../../models";
import { getRegexValidation } from "../../utils";

type MatchFormProps = {
  onSuccess: (values: AssetMatchQueryOptions) => void;
};

export const defaultValues: AssetMatchQueryOptions = {
  aggregationFunction: "mean",
  aggregationWindow: "5m",
};

export function MatchForm({ onSuccess }: MatchFormProps) {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardHeader title={t("ASSET.FORM.FORM_TITLE")} />
      <CardContent>
        <FormContainer defaultValues={defaultValues} onSuccess={onSuccess}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextFieldElement
                fullWidth
                name="aggregationWindow"
                label={t("ASSET.FORM.AGGREGATIO_WINDOW")}
                validation={{
                  pattern: getRegexValidation("INTERVAL", t),
                  required: { message: t("ASSET.FORM.VALIDATION.REQUIRED"), value: true },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <RadioButtonGroup
                label={t("ASSET.FORM.AGGREGATION_FUNCTION")}
                name="aggregationFunction"
                options={aggregationFunctions
                  .filter((v) => v !== "count")
                  .map((func) => ({
                    id: func,
                    label: t(`ASSET.FORM.AGGRETATION_FUNCTION.${func.toUpperCase()}`),
                  }))}
                row
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
