import axios from "axios";
import requestHeader from "@/plugins/header.plugins";

// const URL = import.meta.env.VITE_APP_API_BASEURL_DEV_LOCAL;
// const URL = import.meta.env.VITE_APP_API_BASEURL;
const URL = import.meta.env.VITE_APP_API_BASEURL_DEV;
class ApiService {
    // getMenuDigio(parentid) {
    //     return axios.post(URL + '/menu/get', {}, { headers: requestHeader('menu-digio', parentid) });
    // }

    // validtoken
    validToken() {
        return axios.post(URL + `/home/isValidToken`, {}, { headers: requestHeader('init') });
    }

    // loginvia iframe
    loginIframe() {
        return axios.post(URL + '/auth/loginIframe', {}, { headers: requestHeader('init') });
    }

    // config
    initConfig() {
        return axios.get(URL + `/home/initconfig`, { headers: requestHeader('init') });
    }

    changeConfig(data) {
        return axios.post(URL + '/home/changeconfig', data, { headers: requestHeader('init') });
    }

    // standalone menu
    getMenu(parentid) {
        return axios.post(URL + `/miracle/getAll?parent_menu_id=${parentid}`, {}, { headers: requestHeader('menu') })
    }

    // products
    getProducts() {
        return axios.post(URL + '/products/get', {}, { headers: requestHeader('products') });
    }
    findProduct(uid) {
        return axios.post(URL + '/products/find', { uid: uid }, { headers: requestHeader('products') });
    }
    storeProducts(data) {
        return axios.post(URL + '/products/create', data, { headers: requestHeader('products') });
    }
    updateProducts(data) {
        return axios.post(URL + '/products/update', data, { headers: requestHeader('products') });
    }
    deleteProducts(uid) {
        return axios.post(URL + '/products/delete', { uid: uid }, { headers: requestHeader('products') });
    }

    // infrabooks
    getInfrabooks() {
        return axios.post(URL + '/infrabook/get', {}, { headers: requestHeader('infrabooks') })
    }
    findInfrabook(data) {
        return axios.post(URL + '/infrabook/find', { uuid: data }, { headers: requestHeader('infrabooks') })
    }
    createInfrabook(data) {
        return axios.post(URL + '/infrabook/create', data, { headers: requestHeader('infrabooks') })
    }
    updateInfrabook(data) {
        return axios.post(URL + '/infrabook/update', data, { headers: requestHeader('infrabooks') })
    }
    deleteInfra(uuid) {
        return axios.post(URL + '/infrabook/delete', { uuid: uuid }, { headers: requestHeader('products') });
    }

    // standalone
    getGroup() {
        return axios.post(URL + '/standalone/getGroup', {}, { headers: requestHeader('standalone') });
    }
    getGroupDigio() {
        return axios.post(URL + '/standalone/getDigioGroup', {}, { headers: requestHeader('standalone') });
    }
    addEntity(data) {
        return axios.post(URL + '/standalone/groupCreate', data, { headers: requestHeader('standalone') });
    }
    getStandAlone(data) {
        return axios.post(URL + '/standalone/get', data, { headers: requestHeader('standalone') });
    }
    createStandAlone(data) {
        return axios.post(URL + '/standalone/create', data, { headers: requestHeader('standalone') });
    }
    getMenuStandAlone(data) {
        return axios.post(URL + '/standalone/get', data, { headers: requestHeader('standalone') });
    }
    getMenuDigio(data) {
        return axios.post(URL + '/menu/get', {}, { headers: requestHeader('menu-digio', data) })
    }
    deleteMenuStandalone(data) {
        return axios.post(URL + '/standalone/delete', data, { headers: requestHeader('menu-digio', data) })
    }
    createCopy(data) {
        return axios.post(URL + '/standalone/createCopy', data, { headers: requestHeader('standalone') });
    }
    updateStandalone(data) {
        return axios.post(URL + '/standalone/update', data, { headers: requestHeader('standalone') });
    }



    // override
    getOverride() {
        return axios.post(URL + '/menumapping/get', {}, { headers: requestHeader('menumapping') });
    }
    createOverride(data) {
        return axios.post(URL + '/menumapping/create', data, { headers: requestHeader('menumapping') })
    }
    deleteOverride(data) {
        return axios.post(URL + '/menumapping/delete', data, { headers: requestHeader('menumapping') })
    }

    // fieldmap
    getAllFieldMap() {
        return axios.post(URL + '/fieldmap/getallfieldmap', {}, { headers: requestHeader('menumapping') });
    }
    getFieldMapByGroup(data) {
        return axios.post(URL + '/fieldmap/getgroupfieldmap', data, { headers: requestHeader('menumapping') });
    }
    createFieldMap(data) {
        return axios.post(URL + '/fieldmap/create', data, { headers: requestHeader('menumapping') });
    }
    assignTo(data) {
        return axios.post(URL + '/fieldmap/assignto', data, { headers: requestHeader('menumapping') });
    }
    getGroupWithFieldMap(data) {
        return axios.post(URL + '/fieldmap/getFieldMapWithGroup', data, { headers: requestHeader('standalone') })
    }
    deleteGroupFieldMap(data) {
        return axios.post(URL + '/fieldmap/deleteFieldMapGroup', data, { headers: requestHeader('standalone') })
    }

}

export default new ApiService();