interface IRuntimeConfig {
    AuthorityUrl: string;
    MyServiceUrl: string;
}

export const RuntimeConfig: IRuntimeConfig = {
    AuthorityUrl: ((window as any).runConfig.AuthorityUrl as string).replace(/\/$/, "") + '/',
    MyServiceUrl: ((window as any).runConfig.MyServiceUrl as string).replace(/\/$/, "")
}