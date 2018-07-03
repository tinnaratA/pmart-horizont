const fs = require("fs");
var time_utils = require("../utils/time");
var db = require("../database/nedb");
var permission_utils = require("../utils/permissions");

var user_namespace = "usersdb";
var product_namespace = "productsdb";
var order_namespace = "ordersdb";

let product_list = (req, res) => {
    db[product_namespace].find({}, (err, data) => {
        res.send({success: true, data: data})
    });
}

let get_product = (req, res) => {
    db[product_namespace].findOne({_id: req.params.product_id}, (err, data) => {
        if(err)
            console.log(err);
        else{
            if(data){
                res.send({success: true, data: data});
            }else{
                res.status(204).send({success: true, data: "Product Not Found."})
            }
        }
    });
}

let create_product = (req, res) => {
    try{
        var req_data = req.body;
        if(Object.keys(req_data).length > 0){
            var req_data = time_utils.setObjectTimeStamp(req_data);
            db[product_namespace].insert(req_data, (err) => {
                if(err)
                    console.error(err);
            });
            res.status(201).send({success: true, data: "Product has been created."});
        }
        else
            res.status(400).send({success: true, data: "Invalid JSON."});
    } catch (error) {
        res.status(500).send({success: false, data: "Unexpected Error(s)."})
    }
}

let product_image = (req, res) => {
    if(req.method == "POST"){
        try{
            db[product_namespace].findOne({_id: req.params.product_id}, (err, data) => {
                if(err){
                    console.error(err);
                    return res.status(500).send({success: false, data: "Unexpected Error(s)."});
                }

                if(!data){
                    return res.status(204).send({success: false, data: "Product Not Found."});
                }

                var buffer = req.body;
                var now = new Date();
                var filepath = "./database/images/" + req.params.product_id + ".png"
                if(fs.exists(filepath)) fs.unlink(filepath);
                fs.writeFileSync(filepath, buffer);
                data['images'] = new Array();
                data['images'].push(filepath);
                data['updated'] = time_utils.toLocalTime(new Date());
                db[product_namespace].update({_id: data._id}, {$set: data}, (err) => {
                    if(err){
                        console.error(err);
                        return res.status(500).send({success: false, data: "Unexpected Error(s)."});
                    }
                });
                return res.status(200).send({success: true, data: "File uploaded."});
            });
        } catch(error){
            return res.status(500).send({success: false, data: "Unexpected Error(s)."});
        }
    }else{
        try {
            db[product_namespace].findOne({_id: req.params.product_id}, (err, data) => {
                imageList = new Array();
                imageFileList = data.images;
                for(var i in imageFileList){
                    content = fs.readFileSync(imageFileList[i]);
                    imageList.push(content.toString('base64'));
                };
                return res.send({success: true, data: imageList});
            });
        } catch (error) {
            return res.status(500).send({success: false, data: "Unexpected Error(s)."});
        }
    }
};

module.exports = {
    productList: product_list,
    getProduct: get_product,
    createProduct: create_product,
    productImage: product_image,
}