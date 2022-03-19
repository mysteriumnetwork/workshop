import { GOOGLE_CRAWL_URL } from './constants';
import { wait } from './tools/common';
import crawl from './tools/crawl';

const acceptCookies = async (page: any) => {
    const acceptCookieButton = await page.$('#L2AGLb');
    if (acceptCookieButton) {
        await acceptCookieButton.click();
        await wait(5);
    }
};

(async () => {
    await crawl.visitAndShoot({
        scenario: 'google',
        url: GOOGLE_CRAWL_URL,
        waitBeforeShootSeconds: 7,
        doBeforeShoot: acceptCookies,
    });
})();
