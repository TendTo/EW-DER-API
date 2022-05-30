import React from "react";
import { useGetAssetsMatch } from "../../hooks";
import { MatchChart } from "./MatchChart";
import { MatchForm } from "./MatchForm";

export function MatchList() {
  const { value: assets, execute, status } = useGetAssetsMatch();

  return (
    <>
      <MatchForm onSuccess={execute} status={status} />
      <MatchChart
        consumers={assets ? assets[0] : []}
        producers={assets ? assets[1] : []}
      />
    </>
  );
}
