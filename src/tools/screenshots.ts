import { ScreenshotOptions } from 'puppeteer';

const success = (path: string, filename: string): ScreenshotOptions => {
    return {
        type: 'png',
        path: `${path}/${filename}.png`,
    };
};

const error = (path: string, filename: string): ScreenshotOptions => {
    return {
        type: 'png',
        path: `${path}/error-${filename}.png`,
    };
};

const shots = {
    success,
    error,
};

export default shots;
