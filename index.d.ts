/**
 *
 * @param {(...any) => any} func
 * @returns
 */
export function wrap(func: (...any: any[]) => any): (event: any, context: any, callback: any) => Promise<any>;
export namespace logger {
    export { info };
    export { debug };
    export { warn };
    export { error };
}
declare function MiddyMiddleware(): {
    before: ({ event }: {
        event: any;
    }) => void;
    after: ({ response }: {
        response: any;
    }) => void;
};
/**
 *
 * @param {string} message
 * @param {Record<string, any>?} data
 */
declare function info(message: string, data: Record<string, any> | null): void;
/**
 *
 * @param {string} message
 * @param {Record<string, any>?} data
 */
declare function debug(message: string, data: Record<string, any> | null): void;
/**
 * @param {string} message
 * @param {Record<string, any>| Error | null} dataOrError
 * @param {Error?} error
 * @returns
 */
declare function warn(message: string, dataOrError: Record<string, any> | Error | null, error: Error | null): void;
/**
 * @param {string} message
 * @param {Record<string, any>| Error | null} dataOrError
 * @param {Error?} error
 * @returns
 */
declare function error(message: string, dataOrError: Record<string, any> | Error | null, error: Error | null): void;
export { MiddyMiddleware as Baselime };
//# sourceMappingURL=index.d.ts.map