import { buildFleet } from '../tools/fleet';

(async () => {
    const fleet = await buildFleet();
    await fleet.disconnect();
})();
