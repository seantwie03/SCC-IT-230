export const DEFAULT_SITE_BASE = "/";
export const DEFAULT_PUBLIC_ORIGIN = "https://it230.systemsmetanow.tech";

export function siteConfiguration(environment = process.env) {
    return {
        siteBase: environment.IT230_SITE_BASE ?? DEFAULT_SITE_BASE,
        publicOrigin: environment.IT230_PUBLIC_ORIGIN ?? DEFAULT_PUBLIC_ORIGIN,
    };
}
