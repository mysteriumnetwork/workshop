import puppeteer, { Page } from 'puppeteer';
import { wait } from './common';
import { COUNTRIES, NODES } from './config';
import { newUniqueDir } from './dir';
import { toFile } from './screenshots';

export interface CrawlConfig {
    scenario: string;
    url: string;
    waitBeforeShootSeconds: number;
    doBeforeShoot?: (page: Page) => Promise<void> | void;
    countries?: string[];
}

const visitAndShoot = async (config: CrawlConfig) => {
    const workdir = await newUniqueDir(`${config.scenario}_`);
    const crawlCountries = config.countries || COUNTRIES;
    await Promise.all(crawlCountries.map(country => visitWebAndScreenShoot(workdir, country, config)));
};

const visitWebAndScreenShoot = async (workdir: string, country: string, config: CrawlConfig) => {
    const { proxyPort } = NODES[country];
    const { url, waitBeforeShootSeconds, doBeforeShoot } = config;

    const browser = await puppeteer.launch(browserOptions(proxyPort));
    const page = await browser.newPage();

    try {
        await page.goto(url);

        // page might still bea loading even if DOM is ready, let's give it some time
        await wait(waitBeforeShootSeconds);

        if (doBeforeShoot) {
            await doBeforeShoot(page);
        }
    } finally {
        await page.screenshot(toFile(workdir, country));
    }

    return browser.close();
};

const browserOptions = (proxyPort: number) => ({
    headless: false, // headless mode introduces unexpected behaviour
    defaultViewport: { width: 2560, height: 1440 },
    args: [`--proxy-server=http://localhost:${proxyPort}`],
});

const crawl = {
    visitAndShoot,
};

export default crawl;
