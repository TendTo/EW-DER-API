declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AGGREGATOR_URL?: string;
      PORT?: string;
      PK?: string;
    }
  }
}

export {};
