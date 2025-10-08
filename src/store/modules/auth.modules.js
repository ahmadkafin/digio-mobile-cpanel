import authServices from "@/services/auth.services";

const user = JSON.parse(localStorage.getItem('userdata'));
const initState = user ? { status: { loggedIn: true }, user } : { status: { loggedIn: false }, user: null }

export const auth = {
    namespaced: false,
    state: initState,
    actions: {
        async login({ commit }, user) {
            console.log("called");
            return authServices.login(user).then(
                user => {
                    commit("Login Success", user);
                    return Promise.resolve(user);
                },
                error => {
                    commit("Login Failed");
                    return Promise.reject(error);
                }
            )
        },
        logout({ commit }) {
            authServices.logout();
            commit("logout");
        }
    },
    mutations: {
        loginSuccess(state, user) {
            state.status.loggedIn = true;
            state.user = user;
        },
        loginFailed(state) {
            state.status.loggedIn = false;
            state.user = null
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null
        }
    }
}