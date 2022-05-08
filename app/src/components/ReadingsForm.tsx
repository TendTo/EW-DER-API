import { Send } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Grid } from "@mui/material";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { ReadingsDTOOptions } from "../models";

export type ReadingsFormValuesType = ReadingsDTOOptions & {
  assetDID: string;
  limit: string | number;
  offset: string | number;
};
type ReadingsFormProps = {
  onSuccess: (values: ReadingsFormValuesType) => void;
};

const DIDValidation = {
  value: /^did:ethr:0x[0-9a-fA-F]{40}$/,
  message: "Invalid DID. Must be like did:ethr:<eth-address>",
};
const timeValidationRegex = {
  value:
    /^(?:-(?:\d+(ns|us|ms|mo|s|h|d|w|y|m))+(?<!\d?\1\d.*)(?!.*\d\1\d?)|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)$/,
  message: "Invalid time. Must be a negative timeframe or a date",
};

export const defaultValues: ReadingsFormValuesType = {
  assetDID: "did:ethr:0x0000000000000000000000000000000000000000",
  limit: 10,
  start: "-1d",
  stop: new Date().toISOString().split(".")[0] + "Z",
  offset: 0,
  order: "ASC",
};

export function ReadingsForm({ onSuccess }: ReadingsFormProps) {
  return (
    <Card variant="outlined">
      <CardHeader title="Readings filter" />
      <CardContent>
        <FormContainer defaultValues={defaultValues} onSuccess={onSuccess}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextFieldElement
                fullWidth
                name="assetDID"
                label="Asset DID"
                required
                validation={{ pattern: DIDValidation }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldElement
                fullWidth
                name="start"
                label="Start"
                validation={{ pattern: timeValidationRegex }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldElement
                fullWidth
                name="stop"
                label="Stop"
                required
                validation={{ pattern: timeValidationRegex }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldElement
                fullWidth
                type="number"
                name="limit"
                label="Limit"
                validation={{ min: 1, max: 200 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextFieldElement
                fullWidth
                type="number"
                name="offset"
                label="Offset"
                validation={{ min: 0, max: 200 }}
              />
            </Grid>
            <Grid item xs={8}></Grid>
            <Grid item xs={4} justifyContent="flex-end" container>
              <Button type={"submit"} variant="contained" endIcon={<Send />}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </FormContainer>
      </CardContent>
    </Card>
  );
}
