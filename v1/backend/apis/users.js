var md5 = require('md5');
var time_utils = require("../utils/time");
var db = require("../database/nedb");
var token_utils = require("../utils/token");
var settings = require("../initializer").getSettings("./config.json");
var logger = require("../utils/logger");

var user_namespace = "usersdb";
var token_namespace = "tokensdb";

let login_handler = (req, res) => {
    var req_data = req.body;
    db[user_namespace].findOne(req_data, (err, data) => {
        if(err){
            return res.status(401).send({success: false, data: "Unauthorized"});
        }
        else{
            if(data){
                if(data.is_login){
                    return res.status(401).send({success: false, data: "duplicate login."});
                }

                if(!data.active){
                    return res.status(401).send({success: false, data: "User has been deactivated. Please contact system admin."});
                }

                data.last_login = time_utils.toLocalTime(new Date());
                // data.is_login = true;
                data.is_login = false;
                db[user_namespace].update({_id: data._id}, { $set: data}, (err, updated_data) => {
                    if(err){
                        return res.status(401).send({success: false, data: "Unauthorized"});
                    }
                    else
                        token = token_utils.saveToken(data._id)
                        data['authentication'] = token
                        return res.status(200).send({success: true, data: data});
                });
            }
            else
                return res.status(401).send({success: false, data: "User Not Found."});
        }
    });
};

let register_handler = (req, res) => {
    try {
        var req_data = req.body;
        req_data["type"] = req.body.type || "CUSTOMER"
        req_data.password = md5(req_data.password);
        req_data["active"] = true,
        req_data["last_login"] = null,
        req_data["is_login"] = false
        req_data = time_utils.setObjectTimeStamp(req_data)
    } catch (error) {
        console.error(error);
        return res.status(500).send({success: false, data: "Unexpected Error(s)."});
        
    }

    db[user_namespace].insert(req_data, (err) => {
        if(err){
            console.error(err);
            return res.status(400).send({success: false, data: 'Invalid Parameter(s).'});
        }
        return res.send({"success": true, "data": "User has been created."});
    });
};

let logout_handler = (req, res) => {
    try {
        var req_data = req.body;
    } catch (error) {
        console.error(error);
        return res.status(500).send({success: false, data: "Unexpected Error(s)."});
    }

    db[user_namespace].findOne(req_data, (err, data) => {
        if(err){
            console.error(err);
            return res.status(401).send({success: false, data: "Unauthorized"});
        }else{
            if(data){
                data.is_login = false;
                db[user_namespace].update({_id: data._id}, { $set: data}, (err) => {
                    if(err){
                        console.error(err);
                        return res.status(401).send({success: false, data: "Unauthorized"});
                    }
                    else
                        token_utils.removeToken(data._id);
                        return res.status(200).send({success: true, data: "User has been logged out."});
                });
            }else{
                return res.status(401).send({success: false, data: "User Not Found."});
            }
        }
    });
}

let toggle_active = (req, res) => {
    var check_password = req.body.password || undefined;
    if(check_password === undefined || check_password === null || check_password === ""){
        return res.status(400).send({success: false, data: "Invalid JSON."})
    }

    db[user_namespace].findOne(req.body, (err, data) => {
        if(err){
            console.error(err);
            return res.status(500).send({success: true, data: "Unexpected Error(s)."});
        }

        if(!data){
            return res.status(204).send({success: true, data: "User Not Found."});
        }

        switch(req.method){
            case "PUT": {
                db[user_namespace].update({_id: data._id}, {$set: {active: true}}, {multi: true}, (err) => {
                    if(err){
                        console.error(err);
                        return res.status(500).send({success: true, data: "Unexpected Error(s)."})
                    }
                });
                return res.send({success: true, data: "User has been activated."});
            }
            case "DELETE": {
                var removeflag = req.query.remove || false;
                if(JSON.parse(removeflag)){
                    db[user_namespace].remove({_id: data._id}, (err) => {
                        if(err){
                            console.error(err);
                            return res.status(500).send({success: true, data: "Unexpected Error(s)."})
                        }
                    });
                    return res.send({success: true, data: "User has been deleted."});
                }else{
                    db[user_namespace].update({_id: data._id}, {$set: {active: false}}, {multi: true}, (err) => {
                        if(err){
                            console.error(err);
                            return res.status(500).send({success: true, data: "Unexpected Error(s)."})
                        }
                    });
                    return res.send({success: true, data: "User has been deactivated."});
                }
            }
            default: return res.status(500).send({success: true, data: "Unexpected Error(s)."});
        }
    });
}

module.exports = {
    login: login_handler,
    register: register_handler,
    logout: logout_handler,
    active: toggle_active,
    deactive: toggle_active
}
