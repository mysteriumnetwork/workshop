import { HOTELS_CRAWL_URL } from './constants';
import crawl from './tools/crawl';

(async () => {
    await crawl.visitAndShoot({
        scenario: 'hotels',
        url: HOTELS_CRAWL_URL,
        waitBeforeShootSeconds: 7,
    });
})();
