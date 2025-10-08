const baseUrl = import.meta.env.VITE_APP_API_BASEURL;
const baseUrlDevServer = import.meta.env.VITE_APP_API_BASEURL_DEV;
export const API_ENDPOINTS = {
    login: `${baseUrlDevServer}/auth/login`,
    iframeLogin: `${baseUrlDevServer}/auth/loginIframe`
}