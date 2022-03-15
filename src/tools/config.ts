// port mappings for all NODES described in docker-compose.yml
export const NODES: { [key: string]: { proxyPort: number; tequilaPort: number } } = {
    DE: {
        proxyPort: 10001,
        tequilaPort: 20001,
    },
    LT: {
        proxyPort: 10002,
        tequilaPort: 20002,
    },
    UA: {
        proxyPort: 10003,
        tequilaPort: 20003,
    },
    GB: {
        proxyPort: 10004,
        tequilaPort: 20004,
    },
    JP: {
        proxyPort: 10005,
        tequilaPort: 20005,
    },
    US: {
        proxyPort: 10006,
        tequilaPort: 20006,
    },
    CA: {
        proxyPort: 10007,
        tequilaPort: 20007,
    },
};

export const COUNTRIES = Object.keys(NODES);
