# Aggregator Node

## Description

Node that collects all the aggregated readings coming from any prosumer. Readings could also be negative (consumes). It checks that the rootHash of the aggregated reading is valid, calls the appropriate smart contract on the Energy Web chain and stores the readings on an [InfluxDb database](https://www.influxdata.com/), ready to be queried by any application.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Configuration

The following environment variables can be configured:

```yaml
AGGREGATION_THRESHOLD: 30 # Minimum number of readings needed to accept an aggregated reading
INFLUXDB_HOST: http://localhost:8086 # Host of the InfluxDb
INFLUXDB_TOKEN: universal_api_token # Token used to access InfluxDb
INFLUXDB_ORG: myorg # Organization used on InfluxDb
INFLUXDB_BUCKET: mybucket # Bucket in wich to store the readings on InfluxDb
IDENTITY_MANAGER_ADDRESS: 0x84d0c7284A869213CB047595d34d6044d9a7E14A # Address of the EW's identity manager smart contract on Volta
READINGS_NOTARY_ADDRESS: 0xe574fdd8c3148f2e883612a9c6cda7b9c12d1566 # Address of the Readings Notary smart contract on Volta
SK: <secret-key or mnemonic> # Secret key of mnemonic of the aggregator
JWT_SECRET: <secret for the jwt auth> # Secret key used for the jwt token signing
VOLTA_URL: https://volta-rpc.energyweb.org # Url for the rpc provider for Volta
DISABLE_AUTH: false # Whether to disable the JWT auth
PORT: 3001 # Port the process will run on
CERT_PATH: /etc/httpscerts/public-certificate.pem # Path to the https certificate
KEY_PATH: /etc/httpscerts/private-key.pem # Path to the https key 
```
