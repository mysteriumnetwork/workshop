export const wait = async (seconds: number) => new Promise(r => setTimeout(r, seconds * 1000));

export const log = (message?: any, ...optionalParams: any[]) => console.log(message, ...optionalParams);
