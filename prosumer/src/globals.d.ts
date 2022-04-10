declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AGGREGATOR_URL?: string;
      PORT?: string;
      SK?: string;
      READINGS_NOTARY_ADDRESS?: string;
    }
  }
}

export {};
