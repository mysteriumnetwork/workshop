import { YOUTUBE_CRAWL_URL } from './constants';
import { wait } from './tools/common';
import crawl from './tools/crawl';

const acceptCookies = async (page: any) => {
    const acceptCookieButton = await page.$$('#button.style-scope.ytd-button-renderer.style-primary.size-default');
    if (acceptCookieButton.length > 1) {
        await acceptCookieButton[1].click();
        await wait(5);
    }
};

(async () => {
    await crawl.visitAndShoot({
        scenario: 'youtube',
        url: YOUTUBE_CRAWL_URL,
        waitBeforeShootSeconds: 15,
        doBeforeShoot: acceptCookies,
    });
})();
