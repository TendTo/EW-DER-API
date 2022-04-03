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
