var token_utils = require("./token");

let has_roles = (user, roles) => {
    var token = token_utils.getToken(user._id, token_utils.getToken);
    var expired = token_utils.isExpired(token, token_utils.isExpired);
    console.log(expired, token);
    try {
        return roles.indexOf(user.role) != -1;
    } catch (error) {
        return false
    }
}

module.exports = {
    hasRoles: has_roles
}