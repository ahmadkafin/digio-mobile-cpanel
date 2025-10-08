import { createStore } from "vuex";
import { auth } from './modules/auth.modules';

const store = createStore({
    modules: {
        auth
    }
});

export default store;