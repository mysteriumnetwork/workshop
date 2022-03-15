import puppeteer, { Page } from 'puppeteer';
import { sleep } from './common';
import { COUNTRIES, NODES } from './config';
import { newUniqueDir } from './dir';
import shots from './screenshots';

export interface CrawlConfig {
    scenario: string;
    url: string;
    waitBeforeShootSeconds: number;
    doBeforeShoot?: (page: Page) => Promise<void> | void
    countries?: string[]
}

const visitAndShoot = async (config: CrawlConfig) => {
    const workdir = await newUniqueDir(`${config.scenario}_`);
    const crawlCountries = config.countries || COUNTRIES
    await Promise.all(crawlCountries.map(country => visitWebAndScreenShoot(workdir, country, config)));
};

const visitWebAndScreenShoot = async (workdir: string, country: string, config: CrawlConfig) => {
    const { proxyPort } = NODES[country];
    const browser = await puppeteer.launch({
        headless: false, // headless mode introduces unexpected behaviour
        defaultViewport: { width: 2560, height: 1440 },
        args: [`--proxy-server=http://localhost:${proxyPort}`],
    });
    const page = await browser.newPage();

    try {
        await page.goto(config.url);
        // page might still bea loading even if DOM is ready, let's give it some time
        await sleep(config.waitBeforeShootSeconds);

        if (config.doBeforeShoot) {
            await config.doBeforeShoot(page)
        }

        await page.screenshot(shots.success(workdir, country));
    } catch (err: any) {
        await page.screenshot(shots.error(workdir, country));
        console.log('error:', err);
    }

    await browser.close();
    return Promise.resolve();
};

const crawl = {
    visitAndShoot,
};

export default crawl;
