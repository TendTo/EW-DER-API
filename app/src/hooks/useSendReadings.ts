import { useEthers } from "@usedapp/core";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { AggregatedReadings, ReducedReadingDTO } from "../models";

/**
 * Fetch the aggregated readings logs using the ReadingsNotary contract.
 * @returns aggregated readings logs
 */
export function useSendReadings() {
  const { t } = useTranslation();
  const { library } = useEthers();
  const getReadings = useCallback(
    (readings: ReducedReadingDTO[]) => {
      if (!library) return;
      toast.promise(
        async () => {
          const aggReadings = new AggregatedReadings(readings);
          await aggReadings.sign(library);
          await aggReadings.send();
        },
        {
          pending: t("READINGS.SENDING_PROGRESS"),
          success: t("READINGS.SENDING_SUCCESS"),
          error: t("ERROR.SENDING_READINGS"),
        },
      );
    },
    [library, t],
  );
  return getReadings;
}
