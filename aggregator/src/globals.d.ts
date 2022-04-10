declare global {
  namespace NodeJS {
    interface ProcessEnv {
      INFLUXDB_HOST?: string;
      INFLUXDB_TOKEN?: string;
      INFLUXDB_ORG?: string;
      INFLUXDB_BUCKET?: string;
      PORT?: string;
      SK?: string;
      VOLTA_URL?: string;
    }
  }
}

export {};
