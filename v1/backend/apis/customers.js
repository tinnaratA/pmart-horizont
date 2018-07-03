var db = require("../database/nedb");

var user_namespace = "usersdb";

let customer_list = (req, res) => {
    db[user_namespace].find({type: "CUSTOMER"}, (err, data) => {
        if(err)
            console.error(err);
            
        if(!data){
            res.status(204);
            return res.send({success: true, data: 'Customers Not Found.'});
        }
        return res.send({success: true, data: data})
    });
}

module.exports = {
    customerList: customer_list
}