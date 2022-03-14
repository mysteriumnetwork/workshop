export const sleep = async (s: number) => new Promise(r => setTimeout(r, s * 1000));
