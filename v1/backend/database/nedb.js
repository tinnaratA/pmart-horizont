var fs = require('fs');
var Datastore = require('nedb');
dbconfigs = JSON.parse(fs.readFileSync("./config.json")).database;
var dbs = {};
for(var i in dbconfigs){
    var options = {
        filename: dbconfigs[i],
        autoload: true
    };
    dbnamesplit = dbconfigs[i].split("/");
    dbname = dbnamesplit[dbnamesplit.length - 1];
    dbs[dbname] = new Datastore(options);
}

module.exports = dbs;