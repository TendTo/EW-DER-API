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
      READINGS_NOTARY_ADDRESS?: string;
      IDENTITY_MANAGER_ADDRESS?: string;
      AGGREGATION_THRESHOLD?: string;
      JWT_SECRET?: string;
      DISABLE_AUTH?: string;
      CA_PATH?: string;
      KEY_PATH?: string;
    }
  }
}

export {};
