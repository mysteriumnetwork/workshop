import fs from 'fs';
import { log } from './common';

export const newUniqueDir = async (prefix: string = '') => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/-/g, '_').replace(/T/g, '_').replace(/:/g, '_');
    const dir = `${prefix}${timestamp}`;
    await fs.mkdirSync(dir);
    log('created workdir:', dir);
    return dir;
};
