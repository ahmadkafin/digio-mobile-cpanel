export default function requestHeader(type, menuParentId) {
    let user = JSON.parse(localStorage.getItem('userdata'));
    if (user && user.token) {
        if (type === 'menu-digio') {
            return {
                'Authorization': user.token,
                'username': user.username,
                'directory': user.directory,
                'menu_parentid': menuParentId,
            }
        } else {
            return {
                'Authorization': user.token,
            }
        }
    } else {
        return {}
    }
}