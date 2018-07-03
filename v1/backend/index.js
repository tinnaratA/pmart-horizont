var  express = require("express");
var multer  = require('multer');
var app = express();
var db = require("./database/nedb");
var morgan = require('morgan');

var bodyParser = require('body-parser');
var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(bodyParser.json({ verify: rawBodySaver , limit: '50mb'}));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true , limit: '50mb'}));
app.use(bodyParser.raw({ verify: rawBodySaver, type: function () { return true }, limit: '50mb' }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});
app.use(morgan('common'));

app.use((req, res, next) => {
  token = req.headers.token || null;
  next();
});

// Users APIs
user_apis = require("./apis/users");
app.post('/users/register', user_apis.register);
app.post('/users/login', user_apis.login);
app.post('/users/logout', user_apis.logout);
app.put('/users/active', user_apis.active);
app.delete('/users/deactive', user_apis.deactive);

// Products APIs
product_apis = require("./apis/products");
app.get('/products/list', product_apis.productList);
app.get('/products/:product_id', product_apis.getProduct);
app.post('/products/create', product_apis.createProduct);
app.get('/products/image/:product_id', product_apis.productImage);
app.post('/products/image/:product_id', product_apis.productImage);

// Orders APIs
// SO
order_apis = require("./apis/orders");
app.get('/orders/list', order_apis.so.orderList);
app.post('/orders/create', order_apis.so.createOrder);
app.get('/orders/:order_id', order_apis.so.getOrder);
app.put('/orders/edit', order_apis.so.editOrders);
app.put('/orders/edit/:order_id', order_apis.so.editOrder);
// PO
app.get('/orders/po/list', order_apis.po.purchaseList);
app.get('/orders/po/:po_id', order_apis.po.getOrder);
app.get('/orders/po/:po_id/so/list', order_apis.po.getSoList);
app.put('/orders/po/edit/:po_id', order_apis.po.editOrder);
app.post('/orders/po/create/:vendor_id', order_apis.po.createOrder);

// Customers APIs
customer_apis = require("./apis/customers");
app.get('/customers/list', customer_apis.customerList);

// Vendors APIs
vendor_apis = require("./apis/vendors");
app.get('vendors/list', vendor_apis.vendorList);

// Invoice APIs
inv_apis = require("./apis/invoices");
app.get('/invoices/list', inv_apis.invoiceList);
app.get('/invoices/:inv_id', inv_apis.getInvoice);
app.post('/invoices/create', inv_apis.createInvoice);
app.put('/invoices/edit/:inv_id', inv_apis.editInvoice);
app.put('/invoices/edit', inv_apis.editInvoices);

// Merchandise APIs
merchan_apis = require("./apis/merchandises");
app.get('/merchandise/statistic/:usertype', merchan_apis.getStatistic);

//
// Generate PDF
var fs = require('fs');
var pdf = require('html-pdf');
var template_gen = require('./template_gen/index')

creator = (type, html, options) => new Promise(
    (resolve, reject) => {
        pdf.create(html, options).toFile('./static/pdf/'+ type +inv_no+'.pdf', (err, file) => resolve(err, file) );
    }
)

invoice_generator = (type) => { 
    return async (req, res) => {
        inv_no = req.params.inv_id
        var template = await template_gen(type, inv_no)
        var html = fs.readFileSync(template, 'utf8');
        var options = { format: 'A4'};
        result = await creator(type, html, options)
        return res.send({success: true, path: '/pdf/'+ type +inv_no+'.pdf'});
    }
}

app.get('/pdf/invoice/:inv_id', invoice_generator('invoice'))
app.get('/pdf/saleorder/:inv_id', invoice_generator('saleorder'))
app.get('/pdf/purchaseorder/:inv_id', invoice_generator('purchaseorder'))

app.listen(2002, () => console.log('Application (Back) listening on port 2002!'));
