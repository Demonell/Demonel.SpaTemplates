interface IRuntimeConfig {
    AuthorityUrl: string;
    ProductsUrl: string;
}

export const RuntimeConfig: IRuntimeConfig = {
    AuthorityUrl: ((window as any).runConfig.AuthorityUrl as string).replace(/\/$/, "") + '/',
    ProductsUrl: ((window as any).runConfig.ProductsUrl as string).replace(/\/$/, "")
}