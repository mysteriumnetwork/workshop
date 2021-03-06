import { log } from './common';
import { COUNTRIES, NODES } from './config';
import { buildNodeClient, NodeClient } from './tequila';

export interface Node {
    country: string;
    proxyPort: number;
    client: NodeClient;
}

export const buildFleet = async () => {
    const fleet: Node[] = [];
    for (const country of COUNTRIES) {
        const { proxyPort, tequilaPort } = NODES[country];
        const client = await buildNodeClient(tequilaPort);
        fleet.push({ client, proxyPort, country });
    }
    return new Fleet(fleet);
};

export class Fleet {
    private readonly fleet: Node[] = [];

    constructor(fleet: Node[]) {
        this.fleet = fleet;
    }

    public async printBalances() {
        for (const { client, country } of this.fleet) {
            const id = await client.info();
            log(`${country} - balance:\t${id.balanceTokens.human}`);
        }
    }

    public async makeConnections(retries: number = 3) {
        await Promise.all(
            this.fleet.map(({ country, proxyPort, client }) =>
                client.quickConnectTo(country, {
                    proxyPort,
                    retries,
                }),
            ),
        );
    }

    public async disconnect() {
        for (const { client, country } of this.fleet) {
            try {
                await client.cancelConnection();
                log(`Disconnected from ${country}`);
            } catch (ignored: any) {}
        }
    }
}
