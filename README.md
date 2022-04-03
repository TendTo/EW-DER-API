# Energy Web DER management API

This project contains the source code of the many parts that make up the DER management API.

## 🗂 Project structure

```yaml
.
├── aggregator           # backend owned by an aggregator
├── app                  # frontend application for both aggregators and common users
├── contract             # all the smart contract to deploy on the blockchain
├── der                  # DER simulator as an IOT device
├── docker               # docker stack
├── .gitignore           # .gitignore file
├── LICENSE              # open license of the project
└── README.md            # THIS FILE
```

## 🧾 Requirements

- [Node.js 16](https://nodejs.org/en/)
- [npm 7.x](https://www.npmjs.com/)
- [Docker](https://hub.docker.com/search/?type=edition&offering=community)

> `NOTE:` Node.js version's should be 16.10 <= v < 17. You may encounter some incompatibilities otherwise

### 🐳 Launch the Docker-compose

In the main root of the project, launch the configuration described in the _docker-compose.yaml_ file with

```bash
docker compose up -d
```

To stop the stack, use

```bash
docker compose down
```

Here's the stack this Docker-compose will produce:

## Quando e chi carica le precise proofs?

1. Il prosumer prima di mandare le letture all'aggregatore (no conferma)
1. Il prosumer prima di mandare le letture all'aggregatore e l'aggregatore come conferma
1. L'aggregatore non appena riceve le letture
1. L'aggregatore quando ha raggiunto un volume sufficiente di letture

## Quali informazioni sono mantenute dalle parti?

1. Le letture vengono mantenute dal database dell'aggregatore. Bisogna però assicurarsi che non vengano emesse precise proofs ripetute. Fornire un timestamp dell'ultima prova nell'evento?
1. Vengono comunicate anche al TSO?
1. Il prosumer ha la possibilità di mantenere una traccia delle letture per poter verificare in qualsiasi momento che la precise proof corrisponde. Per poter fare la verifica, però, deve sapere quali delle sue letture sono finite nella precise proof. (si potrebbe aggiungere anche l'aggregatore per una tracciabilità delle responsabilità)
