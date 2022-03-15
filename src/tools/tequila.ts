import { TequilapiClient, Identity, IdentityRegistrationStatus } from 'mysterium-vpn-js';
import { TequilapiClientFactory } from 'mysterium-vpn-js/lib/tequilapi-client-factory';

export interface QuickConnectOptions {
    proxyPort: number;
    retries: number;
}

export class NodeClient {
    private api: TequilapiClient;
    private identity: string = '';

    constructor(port: number) {
        this.api = new TequilapiClientFactory(`http://localhost:${port}/tequilapi`, 40_000).build();
    }

    public async build() {
        await this.api.authAuthenticate({ username: 'myst', password: 'qwerty123456' });
        this.identity = await this.unlockFirstIdentity();
        return this;
    }

    public async unlockFirstIdentity() {
        const list = await this.api.identityList();
        const first = list.find(t => true);
        if (!first) {
            throw new Error('no identity present');
        }
        await this.api.identityUnlock(first.id, '');
        return first.id;
    }

    public async quickConnectTo(country: string, options: QuickConnectOptions) {
        await this.cancelConnection(options.proxyPort);

        const proposals = await this.api.findProposals({ locationCountry: country, ipType: 'residential' });

        if (proposals.length === 0) {
            console.log(`no proposals found for country ${country}; skipping...`);
        }

        let retries = options.retries;
        for (let proposal of proposals) {
            console.log(`connecting to ${country}... (proxyPort: ${options.proxyPort})`);
            try {
                await this.api.connectionCreate({
                    serviceType: 'wireguard',
                    providerId: proposal.providerId,
                    consumerId: this.identity,
                    connectOptions: { proxyPort: options.proxyPort },
                });
                console.log(`connected to: ${country}! (${proposal.providerId})`);
                return;
            } catch (err: any) {
                console.log(`failed to connect ${country}, retries left: ${retries}`);
            }
            retries -= 1;
            if (retries === 0) {
                return;
            }
        }
        console.log(`could not quick connect to ${country}`);
    }

    public async cancelConnection(proxyPort: number) {
        try {
            await this.api.connectionCancel({ proxyPort });
        } catch (ignored: any) {}
    }

    public async disconnectVPN() {
        try {
            await this.api.connectionCancel({ proxyPort: -1 });
        } catch (ignored: any) {}
    }

    public async info(): Promise<Identity> {
        try {
            return await this.api.identity(this.identity);
        } catch (ignored: any) {
            return {
                id: '0x',
                hermesId: '0x',
                registrationStatus: IdentityRegistrationStatus.Unknown,
                channelAddress: '0x',
                balance: 0,
                balanceTokens: {
                    human: '0',
                    wei: '0',
                    ether: '0',
                },
                earnings: 0,
                earningsTotal: 0,
                stake: 0,
            };
        }
    }
}
