var db = require("./database/nedb");
var fs = require("fs");
var time_utils = require("./utils/time");

module.exports = {
    getSettings: (filepath) => {
        return JSON.parse(fs.readFileSync(filepath))
    },
    db: (filepath, to_db) => {
        content = JSON.parse(fs.readFileSync(filepath));
        content.map((d, index) => {
            d = time_utils.setObjectTimeStamp(d)
            db[to_db].insert(d, (err) => {
                if(err)
                    console.error(err);
            });
        });
    },
    cleardb: (to_db=null) => {
        if(to_db)
            db[to_db].remove({}, { multi: true }, (err) => {
                if(err)
                    console.error(err);
            });
        else
            Object.keys(db).map(function(key, index) {
                db[key].remove({}, { multi: true }, (err) => {
                    if(err)
                        console.error(err);
                });
            });
    }
}