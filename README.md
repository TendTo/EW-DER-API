# Energy Web DER management API

[![Docker CI](https://github.com/TendTo/EW-DER-API/actions/workflows/docker.yml/badge.svg?branch=master)](https://github.com/TendTo/EW-DER-API/actions/workflows/docker.yml)

This project contains the source code of the many parts that make up the DER management API.

## 🗂 Project structure

```yaml
.
├── .github              # github actions
├── aggregator           # backend owned by an aggregator
├── app                  # frontend application for both aggregators and common users
├── contract             # all the smart contract to deploy on the blockchain
├── der                  # DER simulator as an IOT device
├── docker               # docker stack
├── docs                 # documentation and architecture's schema
├── prosumer             # backend owned by the prosumer
├── .gitattributes       # .gitattributes file
├── .gitignore           # .gitignore file
├── package.json         # npm package that uses the workspaces functionalities of npm >=7
├── LICENSE              # open license of the project
└── README.md            # THIS FILE
```

## 🧾 Requirements

- [Node.js 16](https://nodejs.org/en/)
- [npm 7.x](https://www.npmjs.com/)
- [Docker](https://hub.docker.com/search/?type=edition&offering=community)

> `NOTE:` Node.js version's should be 16.10 <= v < 17. You may encounter some incompatibilities otherwise

### ⚙️ Docker-compose configuration

To configure the docker-compose, read the [documentation](./docker/README.md).
You can also use a docker-compose.override.yml to set some more confidential settings, like private keys.

### 🐳 Launch the Docker-compose

In the docker folder of the project, launch the configuration described in the _docker-compose.yaml_ file with

```bash
docker compose up -d
```

To stop the stack, use

```bash
docker compose down
```

## Visualization

Here's the stack this Docker-compose will produce:
![stack](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/TendTo/EW-DER-API/master/docs/docker-compose-stack.puml)

What follows is the typical flow of the API:
![flow](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/TendTo/EW-DER-API/master/docs/api-sequence.puml)
