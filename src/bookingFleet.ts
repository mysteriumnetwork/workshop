import { BOOKING_CRAWL_URL } from './constants';
import crawl from './tools/crawl';

(async () => {
    await crawl.visitAndShoot({
        scenario: 'booking_fleet',
        url: BOOKING_CRAWL_URL,
        waitBeforeShootSeconds: 7,
    });
})();
