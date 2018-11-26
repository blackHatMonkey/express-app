const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

let userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{ "dateTime": Date, "userAgent": String }]
});

let User;

/**
 * Connect to the MongoDB database.
 * 
 * @returns {Promise} A Promise object represents connecting to the database.
 */
module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection('mongodb://blackhatmonkey:2018-mlab.COM-2018@ds249737.mlab.com:49737/bti325_a6',
            {
                useNewUrlParser: true,
                useCreateIndex: true,
            });

        db.on('error', (err) => {
            reject(err);
        });

        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

/**
 * Register a new user.
 * 
 * @param {Object} userData An object with user information.
 * @returns {Promise} Promise object represents user registration.
 */
module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {
        if (userData.password.trim().length === 0
            || userData.password2.trim().length === 0) {
            reject("Error: user name cannot be empty or only white spaces! ");
        } else if (userData.password !== userData.password2) {
            reject("Error: Passwords do not match");
        } else {
            bcrypt.hash(userData.password, 10, function (err, hash) {
                if (err) {
                    reject('There was an error encrypting the password');
                } else {
                    userData.password = hash;

                    let newUser = new User(userData);

                    newUser.save((err) => {
                        if (err && err.code === 11000) {
                            reject('User Name already taken');
                        } else if (err && err.code !== 11000) {
                            reject('There was an error creating the user: ' + err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        }
    });
};

/**
 * Authenticate the user.
 * 
 * @param {*} userData An object with user information.
 * @returns {Promise} A Promise object represents the user authentication.
 */
module.exports.checkUser = function (userData) {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName })
            .exec()
            .then((data) => {
                if (data) {
                    bcrypt.compare(userData.password, data.password, (err, res) => {
                        if (res) {
                            data.loginHistory.push({
                                dateTime: (new Date()).toString(),
                                userAgent: userData.userAgent
                            });

                            User.update({ userName: data.userName },
                                { $set: { loginHistory: data.loginHistory } })
                                .exec()
                                .then(() => {
                                    resolve(data);
                                })
                                .catch((err) => {
                                    reject('There was an error verifying the user: ' + err);
                                });
                        } else {
                            reject('Incorrect Password for user: ' + userData.userName);
                        }
                    });
                } else {
                    reject('Unable to find user: ' + userData.userName);
                }
            }).catch(() => {
                reject('Unable to find user: ' + userData.userName);
            }
            );
    });
};