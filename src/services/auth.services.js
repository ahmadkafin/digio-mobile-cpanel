import axios from 'axios';
import { API_ENDPOINTS } from '@/utils/endpoint.utils';

class AuthService {
    async login(user) {
        const env = import.meta.env.VITE_APP_ENVIRONMENT;
        if (env === 'DEV' || env === 'STAG') {
            const data = {
                token: user.token.trim(),
                username: user.username,
                directory: user.directory,
            };
            localStorage.setItem('userdata', JSON.stringify(data));
            return data;
        }

        return await axios.post(API_ENDPOINTS.login, {
            username: user.username,
            password: user.password,
            directory: user.directory,
        }).then((response) => {
            let data = response.data;
            if (data.token) {
                localStorage.setItem('userdata', JSON.stringify(data));
            }
            return data;
        })
    }

    async loginIframe(uuid) {
        return await axios.post(API_ENDPOINTS.iframeLogin, {}, {
            headers: {
                uuid: uuid,
            }
        }).then((response) => {
            const responseData = response.data;
            if (responseData.token) {
                localStorage.setItem('userdata', JSON.stringify(responseData));
            }
            return responseData;
        })
    }

    logout() {
        localStorage.removeItem('userdata');
    }
}

export default new AuthService();
