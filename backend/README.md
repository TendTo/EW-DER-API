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
INFLUXDB_HOST: http://localhost:8086 # Host of the InfluxDb
INFLUXDB_TOKEN: universal_api_token # Token used to access InfluxDb
INFLUXDB_ORG: myorg # Organization used on InfluxDb
INFLUXDB_BUCKET: mybucket # Bucket in wich to store the readings on InfluxDb
PORT: 3000 # Port on wich the process will run
```
