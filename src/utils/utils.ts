export const log = console.log;
export const prettify = (obj: any) => JSON.stringify(obj, null, 2);
export const prettyPrint = (obj: any) => log(prettify(obj));

export const getLast = <TItem>(array: Array<TItem>): TItem | null => array[array.length - 1] ?? null;
export const getFirst = <TItem>(array: Array<TItem>): TItem | null => array[0] ?? null;

export const renderTime = (dateTime: Date) => `${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
