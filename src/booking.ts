import puppeteer from 'puppeteer';
import { BOOKING_CRAWL_URL } from './constants';
import { wait } from './tools/common';
import { newUniqueDir } from './tools/dir';
import { toFile } from './tools/screenshots';
import { buildNodeClient } from './tools/tequila';
import { COUNTRIES } from './tools/config';

const PROXY_PORT = 40001;

(async () => {
    const node = await buildNodeClient(44449);

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 2560, height: 1440 },
        args: [`--proxy-server=http://localhost:${PROXY_PORT}`],
    });
    const page = await browser.newPage();
    const workdir = await newUniqueDir('booking_plain_');

    for (const country of COUNTRIES) {
        try {
            await node.quickConnectTo(country, { proxyPort: PROXY_PORT, retries: 3 });

            await page.goto(BOOKING_CRAWL_URL);
            await wait(7);
        } finally {
            await page.screenshot(toFile(workdir, country));
        }
    }

    await browser.close();
    await node.cancelConnection();
})();
