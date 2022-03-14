import fs from 'fs';

export const newUniqueDir = async (prefix: string = '') => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/-/g, '_').replace(/T/g, '_').replace(/:/g, '_');
    const dir = `${prefix}${timestamp}`;
    await fs.mkdirSync(dir);
    console.log('created workdir:', dir);
    return dir;
};
