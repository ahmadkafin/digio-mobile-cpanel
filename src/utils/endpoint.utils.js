import { BASE_API_URL as baseUrl } from '@/utils/baseUrl.utils';

export const API_ENDPOINTS = {
    login: `${baseUrl}/auth/login`,
    iframeLogin: `${baseUrl}/auth/loginIframe`
}