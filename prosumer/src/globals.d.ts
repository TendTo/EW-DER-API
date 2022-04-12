declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AGGREGATION_THRESHOLD?: string;
      AGGREGATOR_URL?: string;
      PORT?: string;
      SK?: string;
      READINGS_NOTARY_ADDRESS?: string;
      VOLTA_URL?: string;
      PORT?: string;
    }
  }
}

export {};
