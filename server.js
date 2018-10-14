/*********************************************************************************
 *  BTI325 – Assignment 02
 *  I declare that this assignment is my own work in accordance with Seneca
 * Academic Policy.  No part *  of this assignment has been copied manually or
 * electronically from any other source (including 3rd party web sites) or
 * distributed to other students.
 *
 * Name: Brian Smith Student ID: 137105177 Date: 29/09/2018
 *
 * Online (Heroku) Link: https://ancient-beyond-34247.herokuapp.com/
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

const upload = multer({storage: storage});

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
        res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/departments', (req, res) => {
        data_module.getDepartments()
            .then(data => {
                    res.json(data);
            })
            .catch(message => {
                    res.json({message: message});
            });
});

app.get('/managers', (req, res) => {
        data_module.getManagers()
            .then(data => {
                    res.json(data);
            })
            .catch(message => {
                    res.json({message: message});
            });
});

app.get('/employees', (req, res) => {
        if (typeof req.query.status !== 'undefined') {
                data_module.getEmployeesByStatus(req.query.status)
                    .then(data => {
                            res.json(data);
                    })
                    .catch(message => {
                            res.json({message: message});
                    });
        } else if (typeof req.query.department !== 'undefined') {
                data_module.getEmployeesByDepartment(req.query.department)
                    .then(data => {
                            res.json(data);
                    })
                    .catch(message => {
                            res.json({message: message});
                    });
        } else if (typeof req.query.manager !== 'undefined') {
                data_module.getEmployeesByManager(req.query.manager)
                    .then(data => {
                            res.json(data);
                    })
                    .catch(message => {
                            res.json({message: message});
                    });
        } else {
                data_module.getAllEmployees()
                    .then(data => {
                            res.json(data);
                    })
                    .catch(message => {
                            res.json({message: message});
                    });
        }
});

app.get('/employee/:value', (req, res) => {
        data_module.getEmployeeByNum(req.params.value)
            .then(data => {
                    res.json(data);
            })
            .catch(message => {
                    res.json({message: message});
            });
});

app.get('/employees/add', (req, res) => {
        res.sendFile(path.join(__dirname, '/views/addEmployee.html'));
});

app.get('/images/add', (req, res) => {
        res.sendFile(path.join(__dirname, '/views/addImage.html'));
});

app.get('/images', (req, res) => {
        fs.readdir('./public/images/uploaded', function(err, items) {
                res.json(items);
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
