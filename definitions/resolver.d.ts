export declare interface IParsedURIHost {
    host: string;
    port?: number;
}
export declare interface IParsedURI {
    scheme: string;
    username?: string;
    password?: string;
    hosts: IParsedURIHost[];
    database?: string;
    options?: unknown;
}
export default function ResolverModule(): {
    buildPair: (defaultValue: string, a?: string, b?: string | number) => string;
    resolve: (input: unknown, someHost?: IParsedURIHost) => string;
};
//# sourceMappingURL=resolver.d.ts.map