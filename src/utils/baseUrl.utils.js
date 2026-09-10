/**
 * Single source of truth for the API base URL.
 */
export const BASE_API_URL =
    import.meta.env.VITE_APP_ENVIRONMENT === 'STAG' ? import.meta.env.VITE_APP_API_BASEURL_DEV :
    import.meta.env.VITE_APP_ENVIRONMENT === 'DEV'  ? import.meta.env.VITE_APP_API_BASEURL_DEV_LOCAL :
                                                       import.meta.env.VITE_APP_API_BASEURL;
