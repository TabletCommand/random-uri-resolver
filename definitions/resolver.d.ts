export declare interface IParsedURIHost {
    host: string;
    port?: number;
}
export declare interface IParsedURI {
    scheme: string;
    username?: string;
    password?: string;
    hosts: [IParsedURIHost];
    database?: string;
    options?: any;
}
export default function ResolverModule(): {
    buildPair: (defaultValue: string, a?: string | undefined, b?: string | number | undefined) => string;
    resolve: (input: unknown, someHost?: IParsedURIHost | undefined) => string;
};
//# sourceMappingURL=resolver.d.ts.map