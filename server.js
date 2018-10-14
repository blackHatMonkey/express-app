/*********************************************************************************
 *  BTI325 – Assignment 02
 *  I declare that this assignment is my own work in accordance with Seneca
 * Academic Policy.  No part *  of this assignment has been copied manually or
 * electronically from any other source (including 3rd party web sites) or
 * distributed to other students.
 *
 * Name: Brian Smith Student ID: 137105177 Date: 14/10/2018
 *
 * Online (Heroku) Link: https://ancient-basin-91670.herokuapp.com/
 *
 ********************************************************************************/

//@ts-check
'use strict';

const express = require('express');
const data_module = require('./data-server.js');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
        console.log(
            'Server started listening on http://localhost:' + HTTP_PORT);
}

app.use(express.static('public'));
const storage = multer.diskStorage({
        destination: './public/images/uploaded',
        filename: function(req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname));
        }
});

app.engine(
    '.hbs', exphbs({
            extname: '.hbs',
            helpers: {
                    navLink: function(url, options) {
                            return '<li' +
                                ((url == app.locals.activeRoute) ?
                                     ' class="active" ' :
                                     '') +
                                '><a href="' + url + '">' + options.fn(this) +
                                '</a></li>';
                    },
                    equal: function(lvalue, rvalue, options) {
                            if (arguments.length < 3)
                                    throw new Error(
                                        'Handlebars Helper equal needs 2 parameters');
                            if (lvalue != rvalue) {
                                    return options.inverse(this);
                            } else {
                                    return options.fn(this);
                            }
                    }
            },
            defaultLayout: 'main'
    }));
app.set('view engine', '.hbs');

const upload = multer({storage: storage});

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
        let route = req.baseUrl + req.path;
        app.locals.activeRoute =
            (route == '/') ? '/' : route.replace(/\/$/, '');
        next();
});

app.get('/', (req, res) => {
        res.render('home');
});

app.get('/about', (req, res) => {
        res.render('about');
});

app.get('/departments', (req, res) => {
        data_module.getDepartments()
            .then(data => {
                    res.render('departments', {data: data});
            })
            .catch(message => {
                    res.json({message: message});
            });
});

app.get('/employees', (req, res) => {
        if (typeof req.query.status !== 'undefined') {
                data_module.getEmployeesByStatus(req.query.status)
                    .then(data => {
                            res.render('employees', {data: data});
                    })
                    .catch(message => {
                            res.render('employees', {message: message});
                    });
        } else if (typeof req.query.department !== 'undefined') {
                data_module.getEmployeesByDepartment(req.query.department)
                    .then(data => {
                            res.render('employees', {data: data});
                    })
                    .catch(message => {
                            res.render('employees', {message: message});
                    });
        } else if (typeof req.query.manager !== 'undefined') {
                data_module.getEmployeesByManager(req.query.manager)
                    .then(data => {
                            res.render('employees', {data: data});
                    })
                    .catch(message => {
                            res.render('employees', {message: message});
                    });
        } else {
                data_module.getAllEmployees()
                    .then(data => {
                            res.render('employees', {data: data});
                    })
                    .catch(message => {
                            res.render('employees', {message: message});
                    });
        }
});


app.get('/employee/:empNum', (req, res) => {
        data_module.getEmployeeByNum(req.params.empNum)
            .then(data => {
                    res.render('employee', {employee: data});
            })
            .catch(message => {
                    res.render('employee', {message: 'no results'});
            });
});

app.get('/employees/add', (req, res) => {
        res.render('addEmployee');
});

app.get('/images/add', (req, res) => {
        res.render('addImage');
});

app.get('/images', (req, res) => {
        fs.readdir('./public/images/uploaded', function(err, items) {
                res.render('images', {data: items});
        });
});

app.post('/employee/update', (req, res) => {
        console.log(req.body);
        data_module.updateEmployee(req.body)
            .then(() => {
                    res.redirect('/employees');
            })
            .catch(() => {
                    console.log('failed to update employee!');
                    res.redirect('/employees');
            });
});

app.post('/images/add', upload.single('imageFile'), (req, res) => {
        res.redirect('/images');
});

app.post('/employees/add', (req, res) => {
        data_module.addEmployee(req.body)
            .then(() => {
                    res.redirect('/employees');
            })
            .catch(err => {
                    console.log(err);
            });
});

app.use((req, res) => {
        res.status(404).send('Page Not Found');
});

data_module.initialize()
    .then(() => {
            app.listen(HTTP_PORT, onHttpStart);
    })
    .catch(message => {
            console.log(message);
    });
