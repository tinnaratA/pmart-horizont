var db = require("../database/nedb");

var user_namespace = "usersdb";

let vendor_list = (req, res) => {
    db[user_namespace].find({type: "VENDER"}, (err, data) => {
        if(err)
            console.error(err);
        console.log(data);
        if(!data){
            res.status(204);
            return res.send({success: true, data: 'Vendors Not Found.'});
        }
        return res.send({success: true, data: data})
    });
}

module.exports = {
    vendorList: vendor_list
}