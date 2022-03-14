import puppeteer from 'puppeteer';
import { sleep } from './tools/common';
import { COUNTRIES, NODES } from './tools/config';
import { newUniqueDir } from './tools/dir';
import shots from './tools/screenshots';
import { NodeClient } from './tools/tequila';

const CRAWL_URL =
    'https://www.booking.com/searchresults.en-gb.html?label=gen173nr-1FCAEoggI46AdIM1gEaIgBiAEBmAEJuAEZyAEM2AEB6AEB-AELiAIBqAIDuALq1pORBsACAdICJGY1M2I3NjFjLWJiZDYtNDA5Zi05NmRhLWEyODVkZGQ1NDUwYtgCBuACAQ&sid=71025c9500a49b7443a22097bec7ec54&sb=1&sb_lp=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.en-gb.html%3Flabel%3Dgen173nr-1FCAEoggI46AdIM1gEaIgBiAEBmAEJuAEZyAEM2AEB6AEB-AELiAIBqAIDuALq1pORBsACAdICJGY1M2I3NjFjLWJiZDYtNDA5Zi05NmRhLWEyODVkZGQ1NDUwYtgCBuACAQ%3Bsid%3D71025c9500a49b7443a22097bec7ec54%3Bsb_price_type%3Dtotal%26%3B&ss=Hawaii%2C+United+States&is_ski_area=&checkin_year=2022&checkin_month=4&checkin_monthday=1&checkout_year=2022&checkout_month=4&checkout_monthday=10&group_adults=2&group_children=0&no_rooms=1&b_h4u_keep_filters=&from_sf=1&ss_raw=hawaii&ac_position=0&ac_langcode=en&ac_click_type=b&dest_id=2996&dest_type=region&place_id_lat=20.894402&place_id_lon=-157.09085&search_pageview_id=537a78f526480097&search_selected=true&search_pageview_id=537a78f526480097&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0&;changed_currency=1;selected_currency=EUR';

(async () => {
    const workdir = await newUniqueDir('booking_fleet_');
    await Promise.all(COUNTRIES.map(country => visitWebAndScreenShoot(workdir, country)));
})();

const visitWebAndScreenShoot = async (workdir: string, country: string) => {
    const { proxyPort } = NODES[country];
    const browser = await puppeteer.launch({
        headless: false, // headless mode introduces unexpected behaviour
        defaultViewport: { width: 2560, height: 1440 },
        args: [`--proxy-server=http://localhost:${proxyPort}`],
    });
    const page = await browser.newPage();

    try {
        await page.goto(CRAWL_URL);
        // page might still bea loading even if DOM is ready, let's give it some time
        await sleep(7);

        await page.screenshot(shots.success(workdir, country));
    } catch (err: any) {
        await page.screenshot(shots.error(workdir, country));
        console.log('error:', err);
    }

    await browser.close();
    return Promise.resolve();
};
