const uuid = require('uuid/v1');
var db = require("../database/nedb");
var time_uitls = require("../utils/time");
var settings = require("../initializer").getSettings("./config.json");

var user_namespace = "usersdb";
var token_namespace = "tokensdb";

let get_token = (user_id, callback) => {
    db[token_namespace].findOne({user: user_id}, (err, data) => {
        if(err)
            console.error(err);
        else
            return data;
    });
}

let is_expired = (token, callback) => {
    now = time_uitls.toLocalTime(new Date());
    return now.getTime() >= token.exp.getTime();
}

let generate_token = () => {
    return uuid();
}

let save_token = (user_id) => {
    now = new Date();
    exp = time_uitls.toLocalTime(new Date(now.getTime() + (settings.common.authentication.token.timeout * 60 * 1000)));
    var data = {
        user: user_id,
        token: generate_token(),
        exp: exp
    }
    db[token_namespace].insert(data, (err) => {
        if(err)
            console.error(err);
    });
    return data;
}

let remove_token = (user_id) => {
    db[token_namespace].remove({ user: user_id }, { multi: true }, (err) => {
        if(err)
            console.log(err);
    });
}

module.exports = {
    getToken: get_token,
    isExpired: is_expired,
    generateToken: generate_token,
    saveToken: save_token,
    removeToken: remove_token
}