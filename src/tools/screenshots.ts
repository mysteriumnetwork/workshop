import { ScreenshotOptions } from 'puppeteer';

export const toFile = (path: string, filename: string): ScreenshotOptions => {
    return {
        type: 'png',
        path: `${path}/${filename}.png`,
    };
};
