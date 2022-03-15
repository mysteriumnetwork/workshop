import { sleep } from './tools/common';
import crawl from './tools/crawl';

const CRAWL_URL = 'https://www.google.com/search?q=bank';

const acceptCookies = async (page: any) => {
    const acceptCookieButton = await page.$('#L2AGLb');
    if (acceptCookieButton) {
        await acceptCookieButton.click();
        await sleep(5);
    }
};

(async () => {
    await crawl.visitAndShoot({
        scenario: 'google',
        url: CRAWL_URL,
        waitBeforeShootSeconds: 7,
        doBeforeShoot: acceptCookies,
    });
})();
