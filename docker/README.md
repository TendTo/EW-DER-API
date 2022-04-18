# Docker compose

## Description

Simple docker compose file that, when lanched, initializes a simulation of the infrastucture, as described in the _docs_ folder.

## Visualization

Here's the stack this docker-compose will produce:
![stack](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/TendTo/EW-DER-API/master/docs/docker-compose-stack.puml)

What follows is the typical flow of the API:
![flow](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/TendTo/EW-DER-API/master/docs/api-sequence.puml)

## docker-compose.yml

Feel free to edit the _docker-compose.yml_ as you see fit. New DER or prosumers can be added, and the environment variables customized.  
To avoid committing sensitive variables to git, cosider using a _docker-compose.override.yml_ file.

```yml
version: "3.9"

services:
  influxdb:
    image: influxdb:latest
    volumes:
      - influxdbVolume:/var/lib/influxdb2
    environment:
      DOCKER_INFLUXDB_INIT_MODE: setup
      DOCKER_INFLUXDB_INIT_USERNAME: username
      DOCKER_INFLUXDB_INIT_PASSWORD: password
      DOCKER_INFLUXDB_INIT_ORG: myorg
      DOCKER_INFLUXDB_INIT_BUCKET: mybucket
      DOCKER_INFLUXDB_INIT_ADMIN_TOKEN: universal_api_token
    ports:
      - 8086:8086
    networks:
      - aggregator

  aggregator:
    image: tendto/ew-der-api:aggregator
    container_name: aggregatorv
    environment:
      INFLUXDB_HOST: http://influxdb:8086
      INFLUXDB_TOKEN: universal_api_token
      INFLUXDB_ORG: myorg
      INFLUXDB_BUCKET: mybucket
      IDENTITY_MANAGER_ADDRESS: "0x84d0c7284A869213CB047595d34d6044d9a7E14A"
      READINGS_NOTARY_ADDRESS: "0xe574fdd8c3148f2e883612a9c6cda7b9c12d1566"
      VOLTA_URL: https://volta-rpc.energyweb.org
      AGGREGATION_THRESHOLD: "30"
      SK: <secret-key or mnemonic>
      JWT_SECRET: <secret-key or mnemonic>
      PORT: "3000"
    ports:
      - 3000:3000
    networks:
      - default
      - aggregator
    depends_on:
      - influxdb

  prosumer:
    image: tendto/ew-der-api:prosumer
    container_name: prosumer
    environment:
      AGGREGATION_THRESHOLD: "30"
      AGGREGATOR_URL: http://aggregator:3000
      PORT: "3000"
      READINGS_NOTARY_ADDRESS: "0xe574fdd8c3148f2e883612a9c6cda7b9c12d1566"
      SK: <secret-key or mnemonic>
      VOLTA_URL: https://volta-rpc.energyweb.org
    ports:
      - 3001:3000
    networks:
      - default
    depends_on:
      - influxdb
      - aggregator

  der1:
    image: tendto/ew-der-api:der
    container_name: der1
    environment:
      SLEEP_SEC: "4"
      PROSUMER_URL: http://prosumer:3000
      ASSET_DID: did:ethr:0xD6bB29F7332208508BE1C301F4582889E605A33d
    networks:
      - default
    depends_on:
      - prosumer

  der2:
    image: tendto/ew-der-api:der
    container_name: der2
    environment:
      SLEEP_SEC: "5"
      PROSUMER_URL: http://prosumer:3000
      SCALE: "5"
      ASSET_DID: did:ethr:0xff0B184697827882560e08C7AA35531aEEc76aBF
    networks:
      - default
    depends_on:
      - prosumer

  der3:
    image: tendto/ew-der-api:der
    container_name: der3
    environment:
      SLEEP_SEC: "6"
      PROSUMER_URL: http://prosumer:3000
      ASSET_DID: did:ethr:0x96A95cCC7b50BC6c22F2896BBfbE9a9139ae9e15
      NEGATIVE_CONSUME: "true"
    networks:
      - default
    depends_on:
      - prosumer

volumes:
  influxdbVolume:

networks:
  prosumer:
  aggregator:
  default:
```

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
AGGREGATION_THRESHOLD: "30" # minimum amount of readings the aggregator will accept as a valid aggregated reading
IDENTITY_MANAGER_ADDRESS: "0x84d0c7284A869213CB047595d34d6044d9a7E14A" # Address of the EW's identity manager smart contract on Volta
READINGS_NOTARY_ADDRESS: "0xe574fdd8c3148f2e883612a9c6cda7b9c12d1566" # Address of the Readings Notary smart contract on Volta
VOLTA_URL: https://volta-rpc.energyweb.org # Url for the rpc provider for Volta
SK: <secret-key or mnemonic> # Secret key of mnemonic of the aggregator
JWT_SECRET: <secret for the jwt auth> # Secret key used for the jwt token signing
DISABLE_AUTH: false # Whether to disable the JWT auth
PORT: "3000" # Port the process will run on
```

### Prosumer

The following environment variables can be configured:

```yaml
AGGREGATION_THRESHOLD: "30" # Amount of readings to accumulate before sending them. Must be equal or greated than the one configured by the aggregator
AGGREGATOR_URL: http://localhost:3000 # URL of the aggregator node
READINGS_NOTARY_ADDRESS: "0xe574fdd8c3148f2e883612a9c6cda7b9c12d1566" # Address of the Readings Notary smart contract on Volta
SK: <secret-key or mnemonic> # Secret key of mnemonic of the prosumer. Must be the owner of all the DERs
VOLTA_URL: https://volta-rpc.energyweb.org # Url for the rpc provider for Volta
PORT: "3001" # Port the process will run on
```

### DER

The following environment variables can be configured:

```yaml
SLEEP_SEC: "6" # Amount of seconds before each reading submission
PROSUMER_URL: http://prosumer:3000 # Url of the prosumer node this DER belongs to
ASSET_DID: did:ethr:0x96A95cCC7b50BC6c22F2896BBfbE9a9139ae9e15 # DID of the DER
NEGATIVE_CONSUME: "true" # Whether the readings should be negative (consume)
SCALE: "1" # Multiplier applied to the random reading generated
```
