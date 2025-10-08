import axios from 'axios';
import { API_ENDPOINTS } from '@/utils/endpoint.utils';

class AuthService {
    async login(user) {
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

    async loginIframe(data) {
        return await axios.post(API_ENDPOINTS.iframeLogin, {}, {
            headers: {
                uuid: data,
            }
        }).then((response) => {
            let data = response.data;
            if (data.token) {
                localStorage.setItem('userdata', JSON.stringify(data));
            }
            return data;
        })
    }

    logout() {
        localStorage.removeItem('userdata');
    }
}

export default new AuthService();