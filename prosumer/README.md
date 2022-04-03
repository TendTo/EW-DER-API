# Prosumer Node

## Description

Node that collects all the readings from any number of IOT devices and, once it has collected AGGREGATION_THRESHOLD of them, sends them to the configured aggregator, not before having calculated the root hash of the readings.

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
AGGREGATION_THRESHOLD: 2 # Amount of readings to accumulate before sending them. Must be equal or greated than the one configured by the aggregator
AGGREGATOR_URL: http://localhost:3000 # URL of the aggregator node
PORT: 3001 # Port on wich the process will run
```
