var db = require("../database/nedb");
var permissions = require("../utils/permissions");
var time_utils = require("../utils/time");
var array_utils = require("../utils/array");

var user_namespace = "usersdb";
var product_namespace = "productsdb";
var order_namespace = "ordersdb";
var po_namespace = "purchasesdb";

var order_no = 1;

let order_s_list = (req, res) => {
    db[order_namespace].find(req.query, (err, data) => {
        if(err){
            console.log(err);
            return res.send({success: true, data: err});
        }
        else{
            if(!data){
                return res.status(204).send({success: true, data: "Sale Order(s) Not Found."})
            }
            else
            {
                return res.send({success: true, data: data});
            }
        }
    });
};

let order_p_list = (req, res) => {
    db[po_namespace].find(req.query, (err, data) => {
        if(err){
            console.log(err);
            return res.send({success: true, data: err});
        }
        else{
            if(data){
                return res.send({success: true, data: data});
            }
            else
            {
                return res.status(204).send({success: true, data: "Purchase Order(s) Not Found."});
            }
        }
    });
}

let create_s_order = (req, res) => {
    try{
        var req_data = req.body;
        if(Object.keys(req_data).length > 0){
            // Set Id and Timestamp of Object
            var req_data = time_utils.setObjectTimeStamp(req_data);
            req_data['id'] = "ORD" + parseInt(Math.random(1,50) * 10000000000);
            // Get Product real object from database.
            db[product_namespace].find({}, (err, products) => {
                if(err){
                    console.error(err);
                    return res.send(500).send({success: false, data: "Unexpected Error(s)."});
                }
                var finalItems = req_data.arrayitem.map(d => {
                    var find_items = products.filter(item => item.Description == d.item);
                    if (find_items.length > 0) {
                        item = find_items[0];
                        d.vendor = item.vendor;
                        d.processed = false;
                        return d;
                    }
                }).filter(x => x);
                req_data.arrayitem = finalItems;
                db[order_namespace].insert(req_data, (err) => {
                    if(err)
                        console.error(err);
                });
            });
            return res.status(201).send({success: true, data: "Order has been created."});
        }
        else
            return res.status(400).send({success: true, data: "Invalid JSON."});
    } catch (error) {
        return res.status(500).send({success: false, data: "Unexpected Error(s)."})
    }
}

let create_p_order = (req, res) => {
    try {
        var success = true;
        var data = "Purchase Order(s) has been created.";
        var status = 200;

        var orders = req.body;
        var allItems = [];
        var orderIds = orders.map(o => o._id);
        orders.map(
            order => order.arrayitem.filter(d => d.vendor == req.params.vendor_id).map(
                item => {
                    // item['processed'] = true;
                    allItems.push(item);
                }
            )
        );
        orderIds.map(oid => {
            db[order_namespace].findOne({_id: oid}, (err, data) => {
                if(err){
                    console.log(err);
                    return res.status.send({success: false, data: err});
                }
                var items = data.arrayitem.map(item => {
                    if(item.vendor == req.params.vendor_id && allItems.filter(rev_item => rev_item.item == item.item).length > 0)
                        item.processed = true;
                    return item;
                });
                var successflag = data.arrayitem.filter(item => item.processed == false).length <= 0;
                if(successflag){
                    dataToUpdate = {
                        $set: {
                            arrayitem: items,
                            status: "SCHEDULED"
                        }
                    }
                }
                else{
                    dataToUpdate = {
                        $set: {
                            arrayitem: items
                        }
                    }
                }

                db[order_namespace].update({_id: data._id}, dataToUpdate, {multi: true}, (err) => {
                    if(err){
                        console.log(err);
                        return res.status.send({success: false, data: err});
                    }
                });
            });
        });
        

        allItems = array_utils.sortArray(allItems, key="item");
        var uniqueItems = [];
        if(allItems.length > 0){
            allItems.map(d => {
                var itemNames = uniqueItems.map(item => { return item.item });
                if(itemNames.indexOf(d.item) != -1){ // Already in list
                    uniqueItems[uniqueItems.length - 1].qty += parseFloat(d.qty);
                    uniqueItems[uniqueItems.length - 1].price += parseFloat(d.price);
                }
                else{ // Not in list
                    uniqueItems.push(d);
                }
            });

            var deadline = new Date(Math.min(...orders.map(o => {
                ds = new Date(o.delivery);
                return ds.getTime();
            })));
            var grandTotal = uniqueItems.map(item => item.price).reduce(
                (prev, current) => parseInt(prev) + parseInt(current)
            ) * 0.95;
            var dataToSave = {
                _id: orderIds.join("+") + "+" + req.params.vendor_id + "+" +parseInt(Math.random(1,50) * 10000000000),
                id: "PO" + parseInt(Math.random(1,50) * 10000000000),
                vendor: req.params.vendor_id,
                delivery: deadline,
                items: uniqueItems,
                status: "RAISED",
                total: grandTotal,
                so: orderIds,
                date: new Date().getTime()
            };
            db[po_namespace].insert(dataToSave, (err) => {
                if(err){
                    console.error(err);
                    success = false;
                    data = err;
                    status = 500;
                }
                return res.status(status).send({success: success, data: data});
            });
        }
        else
            return res.status(status).send({success: true, data: "No item to create purchase order(s)."});
    } catch (error) {
        console.error(error);
        return res.status(400).send({success: false, data: "Invalid JSON."});
    }
}

let get_order = (req, res) => {
    db[order_namespace].findOne({_id: req.params.order_id}, (err, data) => {
        if(err)
            console.log(err);
        else{
            if(data){
                return res.send({success: true, data: data});
            }else{
                return res.status(204).send({success: true, data: "Order Not Found."});
            }
        }
    });
}

let edit_order = (req, res) => {
    var req_data = req.body;
    db[order_namespace].findOne({_id: req.params.order_id}, (err, data) => {
        if(err){
            console.error(err);
            return res.status(500).send({success: false, data: "Unexpected Error(s)."});
        }

        if(!data){
            return res.status(204).send({success: true, data: "Order Not Found"});
        }

        db[order_namespace].update({_id: data._id}, {$set: req_data}, (err) => {
            if(err){
                console.error(err);
                return res.status(400).send({success: true, data: "Invalid JSON."});
            }
            return res.send({success: true, data: "Order has been updated."})            
        });

    });
}

let edit_orders = (req, res) => {
    var req_data = req.body;
    req_data.map(
        (d, index) => {
            db[order_namespace].findOne(
                {_id: d._id}, 
                (err, olddata) => {
                    if(err){
                        console.error(err);
                        return res.status(500).send({success: false, data: "Unexpected Error(s)."});
                    }

                    if(!olddata){
                        return res.status(204).send({success: true, data: "Order Not Found"});
                    }
                    var newdata = olddata;
                    newdata.status = d.status;
                    db[order_namespace].update({_id: olddata._id}, {$set: newdata}, (err, data) => {
                        if(err){
                            console.error(err);
                            return res.status(400).send({success: true, data: "Invalid JSON."});
                        }            
                    });
                }
            );
        }
    );
    return res.send({success: true, data: "Order has been updated."})
}

let get_p_order = (req, res) => {
    var status = 200;
    var data = null;
    var success = false;

    db[po_namespace].findOne({_id: req.params.po_id}, (err, data) => {
        if(err){
            console.error(err);
            status = 500;
            data = err;
            success = false;
            return res.status(status).send({success: success, data: data});
        }
        else if(!data){
            status = 204;
            data = null;
            success = true;
            return res.status(status).send({success: success, data: data});
        }
        else
        {  
            status = 200;
            data = data;
            success = true;
            return res.status(status).send({success: success, data: data});
        }
    });
}

let edit_p_order = (req, res) => {
    db[po_namespace].findOne({_id: req.params.po_id}, (err, data) => {
        if(err){
            console.error(err);
            return res.status(500).send({success: false, data: err});
        }
        else
        {
            if(data){
                var dataToUpdate = {
                    $set: req.body
                }
                db[po_namespace].update({_id: data._id}, dataToUpdate, {multi: true}, (err) => {
                    if(err){
                        console.error(err)
                        return res.status(500).send({success:false, data: "Unexpected Error(s)."})
                    }
                    return res.status(200).send({success: true, data: "Purchase Order has been updated."})
                });
            }
            else
            {
                return res.status(240).send({success: true, data: "Purchase Order(s) Not Found."})
            }
        }
    })
}

let get_so_list = (req, res) => {
    if(!req.params.po_id){
        return res.status(400).send({success: false, data: 'Bad Request'})
    }
    else
    {
        db[po_namespace].findOne({_id: req.params.po_id}, (err, data) => {
            if(err){
                console.error(err)
                return res.status(500).send({success:false, data: err})
            }
            else
            {
                if(data){
                    var soIds = data.so;
                    db[order_namespace].find({_id: { $in: soIds }}, (err, sorders) => {
                        if(err){
                            console.error(err);
                            return res.status(500).send({success: true, data: err});
                        }
                        else
                        {
                            return res.status(200).send({success: true, data: sorders});
                        }
                    });
                }
                else
                {
                    return res.status(204).send({success: true, data: "Purchase Order(s) Not Found."})
                }
            }
        });
    }
}

module.exports = {
    so: {
        orderList: order_s_list,
        getOrder: get_order,
        createOrder: create_s_order,
        editOrder: edit_order,
        editOrders: edit_orders
    },
    po: {
        purchaseList: order_p_list,
        createOrder: create_p_order,
        getOrder: get_p_order,
        editOrder: edit_p_order,
        getSoList: get_so_list,
    }
}