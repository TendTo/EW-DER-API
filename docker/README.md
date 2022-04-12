# Docker compose

## Description

Simple docker compose file that, when lanched, initializes a simulation of the infrastucture, as described in the _docs_ folder.

## Running the app

```bash
# initialize the stack
$ docker compose up

# stop the stack
$ docker compose stop

# remove the stack
$ docker compose down
```

## Configuration

All the environment variables can be configured, but make sure that the new values are valid. See each service's folder to check for costrains.

### InfluxDB

The following environment variables can be configured:

```yaml
DOCKER_INFLUXDB_INIT_MODE: setup # Start the setup of InfluxDB
DOCKER_INFLUXDB_INIT_USERNAME: username # User's username
DOCKER_INFLUXDB_INIT_PASSWORD: password # User's password
DOCKER_INFLUXDB_INIT_ORG: myorg # Organization
DOCKER_INFLUXDB_INIT_BUCKET: mybucket # Bucket used to store the data in
DOCKER_INFLUXDB_INIT_ADMIN_TOKEN: universal_api_token # Token used to interact with InfluxDB through the API
```
### Aggregator

The following environment variables can be configured:

```yaml
INFLUXDB_HOST: http://localhost:8086 # Host of the InfluxDb
INFLUXDB_TOKEN: universal_api_token # Token used to access InfluxDb
INFLUXDB_ORG: myorg # Organization used on InfluxDb
INFLUXDB_BUCKET: mybucket # Bucket in wich to store the readings on InfluxDb
IDENTITY_MANAGER_ADDRESS: 0x84d0c7284A869213CB047595d34d6044d9a7E14A # Address of the EW's identity manager smart contract on Volta
READINGS_NOTARY_ADDRESS: 0xe574fdd8c3148f2e883612a9c6cda7b9c12d1566 # Address of the Readings Notary smart contract on Volta
VOLTA_URL: https://volta-rpc.energyweb.org # Url for the rpc provider for Volta
SK: <secret-key or mnemonic> # Secret key of mnemonic of the aggregator
PORT: 3000 # Port the process will run on
```

### Prosumer

The following environment variables can be configured:

```yaml
AGGREGATION_THRESHOLD: 10 # Amount of readings to accumulate before sending them. Must be equal or greated than the one configured by the aggregator
AGGREGATOR_URL: http://localhost:3000 # URL of the aggregator node
IDENTITY_MANAGER_ADDRESS: 0x84d0c7284A869213CB047595d34d6044d9a7E14A # Address of the EW's identity manager smart contract on Volta
READINGS_NOTARY_ADDRESS=0xe574fdd8c3148f2e883612a9c6cda7b9c12d1566 # Address of the Readings Notary smart contract on Volta
SK=<secret-key or mnemonic> # Secret key of mnemonic of the prosumer. Must be the owner of all the DERs
VOLTA_URL: https://volta-rpc.energyweb.org # Url for the rpc provider for Volta
PORT: 3001 # Port the process will run on
```
