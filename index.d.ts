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
 * @param {Record<string, any>=} data
 */
declare function info(message: string, data?: Record<string, any> | undefined): void;
/**
 *
 * @param {string} message
 * @param {Record<string, any>=} data
 */
declare function debug(message: string, data?: Record<string, any> | undefined): void;
/**
 * @param {string} message
 * @param {Record<string, any>| Error=} dataOrError
 * @param {Error=} error
 * @returns
 */
declare function warn(message: string, dataOrError?: (Record<string, any> | Error) | undefined, error?: Error | undefined): void;
/**
 * @param {string} message
 * @param {Record<string, any>| Error=} dataOrError
 * @param {Error=} error
 * @returns
 */
declare function error(message: string, dataOrError?: (Record<string, any> | Error) | undefined, error?: Error | undefined): void;
export { MiddyMiddleware as Baselime };
//# sourceMappingURL=index.d.ts.map