var db = require("../database/nedb");

var po_namespace = "purchasesdb";
var order_namespace = "ordersdb";
var user_namespace = "usersdb";

function orderSummary(users, data){
    var summary = new Array();
    data.map(order => {
        var vendors = Array.from(new Set(order.arrayitem.map(item => item.vendor)));
        var items = new Array();
        vendors.map(v => {
            var itemList = order.arrayitem.filter(o => o.vendor == v);
            var total = itemList.map(item => {
                return parseFloat(item.delivered) * parseFloat(item.unitprice);
            }).reduce((prev, current) => prev + current);
            items.push({vendor: users.filter(u => u._id == v).map(u => u.name)[0], total: total});
        });
        var grandTotal = items.map(item => item.total).reduce((prev, current) => prev + current);
        var s = {
            _id: order._id,
            id: order.id,
            customer: order.customer,
            incomes: items,
            total: grandTotal,
            status: order.status
        }
        summary.push(s);
    });
    return summary;
}

function purchaseOrderSummary(users, data){
    var summary = new Array();
    data.map(porder => {
        var costs = porder.items.map(item => {
            return {
                item: item.item,
                total: parseFloat(item.delivered) * parseFloat(item.unitprice)
            };
        });
        var total = costs.map(c => c.total).reduce((prev, current) => prev + current);
        var s = {
            _id: porder._id,
            id: porder.id,
            vendor: porder.vendor,
            costs: costs,
            total: total,
            status: porder.status
        }
        summary.push(s);
    });
    return summary;
}

let get_statistic = (req, res) => {
    var usertype = req.params.usertype || null;
    db[user_namespace].find({}, (err, users) => {
        if(err){
            console.error(err);
            return res.status(500).send({success: false, data: err});
        }
        else
        {
            if(usertype == "CUSTOMER"){
                db[order_namespace].find({}, (err, data) => {
                    if(err){
                        console.error(err);
                        return res.status(500).send({success: false, data: err});
                    }
                    else{
                        if(data){
                            var summary = orderSummary(users, data);
                            return res.status(200).send({success: true, data: summary});
                        }
                        else{
                            return res.status(204).send({success: true, data: "No Order(s)."});
                        }
                    }
                });
            }
            else if(usertype == "VENDER"){
                db[po_namespace].find({}, (err, data) => {
                    if(err){
                        console.error(err);
                        return res.status(500).send({success: false, data: err});
                    }
                    else{
                        if(data){
                            var summary = purchaseOrderSummary(users, data);
                            return res.status(200).send({success: true, data: summary});
                        }
                        else{
                            return res.status(204).send({success: true, data: "No Order(s)."});
                        }
                    }
                });
            }
            else{
                return res.status(400).send({success: true, data: "Invalid user type."});
            }
        }
    });
};

module.exports = {
    getStatistic: get_statistic
};