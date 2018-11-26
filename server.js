/*********************************************************************************
 *  BTI325 – Assignment 04
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
const dataServiceAuth = require('./data-service-auth.js');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const clientSessions = require('client-sessions');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;


function ensureLogin(req, res, next) {
  if (!Object.keys(req.session).length) {
    res.redirect("/login");
  } else {
    next();
  }
};

app.use(express.static('public'));
const storage = multer.diskStorage({
  destination: './public/images/uploaded',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

app.engine(
  '.hbs', exphbs({
    extname: '.hbs',
    helpers: {
      navLink: function (url, options) {
        return '<li' +
          ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
          '><a href="' + url + '">' + options.fn(this) + '</a></li>';
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error('Handlebars Helper equal needs 2 parameters');
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

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(clientSessions({
  cookieName: "session",
  secret: "AVeryLongLongLongLongSecret",
  duration: 2 * 60 * 1000,
  activeDuration: 1000 * 60
}));

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  res.locals.session = req.session;
  app.locals.activeRoute = (route == '/') ? '/' : route.replace(/\/$/, '');
  next();
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/departments', ensureLogin, (req, res) => {
  data_module.getDepartments()
    .then((data) => {
      if (data.length > 0) {
        res.render('departments', { data: data });
      } else {
        res.render('departments', { message: 'no results' });
      }
    })
    .catch((message) => {
      res.json({ message: message });
    });
});

app.get('/employees', ensureLogin, (req, res) => {
  if (typeof req.query.status !== 'undefined') {
    data_module.getEmployeesByStatus(req.query.status)
      .then((data) => {
        if (data.length > 0) {
          res.render('employees', { data: data });
        } else {
          res.render('employees', { message: 'no results' });
        }
      })
      .catch((message) => {
        res.render('employees', { message: message });
      });
  } else if (typeof req.query.department !== 'undefined') {
    data_module.getEmployeesByDepartment(req.query.department)
      .then((data) => {
        if (data.length > 0) {
          res.render('employees', { data: data });
        } else {
          res.render('employees', { message: 'no results' });
        }
      })
      .catch((message) => {
        res.render('employees', { message: message });
      });
  } else if (typeof req.query.manager !== 'undefined') {
    data_module.getEmployeesByManager(req.query.manager)
      .then((data) => {
        if (data.length > 0) {
          res.render('employees', { data: data });
        } else {
          res.render('employees', { message: 'no results' });
        }
      })
      .catch((message) => {
        res.render('employees', { message: message });
      });
  } else {
    data_module.getAllEmployees()
      .then((data) => {
        if (data.length > 0) {
          res.render('employees', { data: data });
        } else {
          res.render('employees', { message: 'no results' });
        }
      })
      .catch((message) => {
        res.render('employees', { message: message });
      });
  }
});


app.get('/employee/:empNum', ensureLogin, (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};

  data_module.getEmployeeByNum(req.params.empNum)
    .then((data) => {
      if (data) {
        viewData.employee = data;
      } else {
        viewData.employee = null;
      }
    })
    .catch(() => {
      viewData.employee = null;
    })
    .then(data_module.getDepartments)
    .then((data) => {
      viewData.departments = data;

      for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId ==
          viewData.employee.department) {
          viewData.departments[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.departments = [];
    })
    .then(() => {
      if (viewData.employee == null) {
        console.log('HERE');
        res.status(404).send('Employee Not Found');
      } else {
        res.render('employee', { viewData: viewData });
      }
    });
});

app.get('/department/:departmentId', ensureLogin, (req, res) => {
  data_module.getDepartmentById(req.params.departmentId)
    .then((data) => {
      if (typeof data !== 'undefined') {
        res.render('department', { data: data });
      } else {
        res.status(404).send('Department Not Found');
      }
    })
    .catch((err) => {
      res.status(404).send('Department Not Found');
    });
});

app.get('/employees/delete/:empNum', ensureLogin, (req, res) => {
  data_module.deleteEmployeeByNum(req.params.empNum)
    .then(() => {
      res.redirect('/employees');
    })
    .catch(() => {
      res.status(500).send('Unable to Remove Employee');
    });
});

app.get('/employees/add', ensureLogin, (req, res) => {
  data_module.getDepartments()
    .then((data) => {
      res.render('addEmployee', { departments: data });
    })
    .catch(() => {
      res.render('addEmployee', { departments: [] });
    });
});

app.get('/images/add', ensureLogin, (req, res) => {
  res.render('addImage');
});

app.get('/images', ensureLogin, (req, res) => {
  fs.readdir('./public/images/uploaded', function (err, items) {
    res.render('images', { data: items });
  });
});

app.get('/departments/add', ensureLogin, (req, res) => {
  res.render('addDepartment');
});

app.post('/employee/update', ensureLogin, (req, res) => {
  data_module.updateEmployee(req.body)
    .then(() => {
      res.redirect('/employees');
    })
    .catch(() => {
      console.log('failed to update employee!');
      res.redirect('/employees');
    });
});

app.post('/images/add', upload.single('imageFile'), ensureLogin, (req, res) => {
  res.redirect('/images');
});

app.post('/employees/add', ensureLogin, (req, res) => {
  data_module.addEmployee(req.body)
    .then(() => {
      res.redirect('/employees');
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/departments/add', ensureLogin, (req, res) => {
  data_module.addDepartment(req.body)
    .then(() => {
      res.redirect('/departments');
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/departments/update', ensureLogin, (req, res) => {
  console.log('here:' + req.body);
  data_module.updateDepartment(req.body)
    .then(() => {
      res.redirect('/departments');
    })
    .catch((err) => {
      console.log(err);
    })
});

app.get('/userHistory', ensureLogin, (req, res) => {
  res.render('userHistory');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  dataServiceAuth.registerUser(req.body)
    .then(() => {
      res.render('register', { successMessage: "User created" });
    })
    .catch((err) => {
      res.render('register', { data: { errorMessage: err, userName: req.body.userName } });
    });
});

app.post('/login', (req, res) => {
  // we need to store the user agent in database
  req.body.userAgent = req.get('User-Agent');

  dataServiceAuth.checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
      };
      res.redirect('/employees');
    })
    .catch((err) => {
      res.render('login', { data: { errorMessage: err, userName: req.body.userName } });
    });
});

app.get('/logout', (req, res) => {
  req.session.reset();
  res.redirect('/');
});

app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

data_module.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log('Server started listening on http://localhost:' + HTTP_PORT);
    });
  })
  .then(dataServiceAuth.initialize)
  .catch((message) => {
    console.log(message);
  });