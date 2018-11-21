const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect('mongodb://blackhatmonkey:2018-mlab.COM-2018@ds249737.mlab.com:49737/bti325_a6');

let historySchema = new Schema({
    "dateTime": Date,
    "userAgent": String
});

let userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [historySchema]
});

let User;

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("connectionString");

        ­­on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};