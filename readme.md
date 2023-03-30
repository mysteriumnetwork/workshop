# Mysterium Network Workshop Code

## Pre-requisites

- docker
- docker-compose
- NodeJS 14
- Yarn

## Running

1) Make sure nodes are running. All nodes can be spun up using docker-compose:
```shell
docker-compose up fleet
```
or
```shell
yarn fleet-start
```

2) After launching all nodes, you need to register each individual node by navigating to NodeUI and completing on-boarding:

**Attention**: you **must** use "Deposit x.x MYST" payment option for this. Transfer **double** the amount which is asked the un-used amount will be then deposited to you **balance**.  
**PayPal** or **Credit** Card registration will not yield you any balance afterwards.

> Make sure to set your password to `qwerty123456` - all scripts will expect this

- For single node use case:  
http://localhost:44449  
  
- Node fleet use case:  
http://localhost:20001  
http://localhost:20002  
http://localhost:20003  
http://localhost:20004  
http://localhost:20005  
http://localhost:20006  
http://localhost:20007  

3) After all nodes have been registered you need to instruct each one to connect to respective country

```shell
yarn fleet-connect
```

This will try to connect to the listed countries `residential` node, and will tell node to act as http proxy

```shell
yarn fleet-info
```

Will print out each node balance in MYST - 0 balance means that node will not be able to pay for traffic

4) Finally, you can begin scraping ;)

- `yarn booking` - will run a scraping using single node (slow but simple setup)
- `yarn booking-fleet` - will run scraping use case on multiple nodes at once (fast but more complex setup)
- `yarn google-fleet` - fast crawl google search
- `yarn hotels-fleet` - fast crawl hotels.com

## Fleet commands

- `yarn fleet-start` spins up docker containers with myst node
- `yarn fleet-stop` stop all docker containers
- `yarn fleet-restart` stop and start all docker containers
- `yarn fleet-info` print each node balance
- `yarn fleet-connect` connect each node to respective country (configuration is in `config.ts`)
- `yarn fleet-disconnect` disconnects all nodes from providers (active connection drains MYST over time)

## Utility commands

- `yarn fix` runs prettier to fix the code style

## NOTE:

> !!! DO NOT REMOVE ANY MOUNTED VOLUMES (MAKE BACKUP)
> 
Registrations are not free, they require a tiny bit of MYST, it is possible to pay with credit card too a symbolic sum of ~1$  

Volumes will contain `keystore` for each node which is your wallet with money (MYST)      

Volumes will bea created in the root of this project. You will have to `chown -R <user> myst-nodes-*` in order to access them.


