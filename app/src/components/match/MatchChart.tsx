import { Send } from "@mui/icons-material";
import { Alert, AlertTitle, Button, Divider, Grid, List } from "@mui/material";
import React, { useEffect, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Asset } from "../../models";
import { MatchItem } from "./MatchItem";

type ReadingListProps = {
  consumers: Asset[];
  producers: Asset[];
};

type ReadingListState = ReadingListProps & {
  consumedValue: number;
  producedValue: number;
};

type ActionType =
  | { type: "SELECT_CONSUMER" | "SELECT_PRODUCER"; payload: Asset }
  | { type: "RESET"; payload: null };

function reducer(
  state: ReadingListState,
  { type, payload }: ActionType,
): ReadingListState {
  switch (type) {
    case "SELECT_CONSUMER":
      const consumerIdx = state.consumers.findIndex(
        (c) => c.assetDID === payload.assetDID,
      );
      if (consumerIdx !== -1) {
        state.consumers.splice(consumerIdx, 1);
        state.consumedValue += payload.value;
      } else {
        state.consumers.push(payload);
        state.consumedValue -= payload.value;
      }
      return { ...state };
    case "SELECT_PRODUCER":
      const prosumerIdx = state.producers.findIndex(
        (p) => p.assetDID === payload.assetDID,
      );
      if (prosumerIdx !== -1) {
        state.producers.splice(prosumerIdx, 1);
        state.producedValue -= payload.value;
      } else {
        state.producers.push(payload);
        state.producedValue += payload.value;
      }
      return { ...state };
    case "RESET":
      return { consumedValue: 0, producedValue: 0, consumers: [], producers: [] };
    default:
      return state;
  }
}

function sendMatch(isSufficient: boolean, valid: boolean) {
  if (!valid) toast.error("At least one producer and one consumer must be selected!");
  else if (!isSufficient) toast.error("Insufficient match!");
  else toast.success("Match sent! 🎉 (WORK IN PROGRESS)");
}

export function MatchChart({ consumers, producers }: ReadingListProps) {
  const { t } = useTranslation();

  const [
    {
      consumers: selectedConsumers,
      producers: selectedProducers,
      consumedValue,
      producedValue,
    },
    dispatcher,
  ] = useReducer(reducer, {
    consumers: [],
    producers: [],
    consumedValue: 0,
    producedValue: 0,
  });

  useEffect(() => {
    dispatcher({ type: "RESET", payload: null });
  }, [consumers, producers]);

  const sufficient = producedValue >= consumedValue;
  const valid = consumedValue > 0 && producedValue > 0;
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={6}>
        <List component="nav">
          {consumers.length > 0 ? (
            consumers.map((asset) => (
              <MatchItem
                key={asset.assetDID}
                sufficient={sufficient}
                selected={!!selectedConsumers.find((a) => a.assetDID === asset.assetDID)}
                asset={asset}
                onClick={(asset: Asset) =>
                  dispatcher({ type: "SELECT_CONSUMER", payload: asset })
                }
              />
            ))
          ) : (
            <Alert severity="info">
              <AlertTitle>{t("GENERAL.INFO")}</AlertTitle>
              {t("MATCH.FORM.NO_CONSUMERS")}
            </Alert>
          )}
        </List>
      </Grid>
      <Grid item xs={12} sx={{ display: { md: "none" } }}>
        <Divider />
      </Grid>
      <Grid item xs={12} md={6}>
        <List component="nav">
          {producers.length > 0 ? (
            producers.map((asset) => (
              <MatchItem
                key={asset.assetDID}
                sufficient={sufficient}
                selected={!!selectedProducers.find((a) => a.assetDID === asset.assetDID)}
                asset={asset}
                onClick={(asset: Asset) =>
                  dispatcher({ type: "SELECT_PRODUCER", payload: asset })
                }
              />
            ))
          ) : (
            <Alert severity="info">
              <AlertTitle>{t("GENERAL.INFO")}</AlertTitle>
              {t("MATCH.FORM.NO_PRODUCER")}
            </Alert>
          )}
        </List>
      </Grid>
      <Grid item xs={8} />
      <Grid item xs={4} textAlign="end">
        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={() => sendMatch(sufficient, valid)}
        >
          {t("GENERAL.SUBMIT")}
        </Button>
      </Grid>
    </Grid>
  );
}
