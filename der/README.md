# Decentralized Energy Resource (DER)

## Description

Simple bash script that simulates a DER. It will send readings with some random value at some time interval.

## Running the app

```bash
# Start the script
$ sh iot_source.sh
```

## Configuration

The following environment variables can be configured:

```yaml
SLEEP_SEC: "6" # Amount of seconds before each reading submission
PROSUMER_URL: http://prosumer:3000 # Url of the prosumer node this DER belongs to
ASSET_DID: did:ethr:0x96A95cCC7b50BC6c22F2896BBfbE9a9139ae9e15 # DID of the DER
NEGATIVE_CONSUME: "true" # Whether the readings should be negative (consume)
SCALE: "1" # Multiplier applied to the random reading generated
```
