// Prevent stack trace to be sent
process.env.NODE_ENV = 'production';

// Globals
const PORT = 80;
const STATIC_DIR_NAME = '/www/';

// Persist Server
const PERSIST_SERVER_ADDR = 'localhost';
const PERSIST_SERVER_MGMNT_ENDPOINT_GET = '/data/persist/';
const PERSIST_SERVER_MGMNT_ENDPOINT_DELETE = '/data/clean/';
const PERSIST_SERVER_IMGS = '/img/';
const PERSIST_SERVER_PORT = 4000;
const persist_server_url = "http://" + PERSIST_SERVER_ADDR + ":" + PERSIST_SERVER_PORT;

const USERS_TABLE_NAME = "Users";

// Start app
const express = require("express");
const app = express();

// Protect
let helmet = require('helmet');
app.use(helmet());

// Cookies managing middleware
cookieParser = require('cookie-parser');
app.use(cookieParser());


// Logging middleware
const morgan = require('morgan');
app.use(morgan('combined'));


// Static files globals
const path = require("path");
const static_path = path.join(__dirname, STATIC_DIR_NAME);


// Use helper functions
const persistApi = require('./persistApi');


// Authenticate API
app.get("/static/register.html", (req, res) => {
   res.sendFile(path.join(static_path, 'register.html'));
});


app.get("/static/login.html", (req, res) => {
    res.sendFile(path.join(static_path, 'login.html'));
});

// Verify cookie
function isAdminRequest(req) {
    return req.cookies.user === 'admin';
}

let request = require('request');
app.get('/data/persist/:entityName', function(req, res) {
    if (isAdminRequest(req)) {
        console.log("[GET /data/persist]");
        let entityName = req.params.entityName;
        let url = persist_server_url + PERSIST_SERVER_MGMNT_ENDPOINT_GET + entityName;
        let r = request(url);
        req.pipe(r).pipe(res);
    }
    else {
        res.end("Unauthorized request. Only the admin user can use /data/ management endpoint.")
    }
});

app.get('/data/clean/:entityName', function(req, res) {
    if (isAdminRequest(req)) {
        console.log("[GET /data/clean]");
        let entityName = req.params.entityName;
        let url = persist_server_url + PERSIST_SERVER_MGMNT_ENDPOINT_DELETE + entityName;
        let r = request(url);
        req.pipe(r).pipe(res);
    }
    else {
        res.end("Unauthorized request. Only the admin user can use /data/ management endpoint.")
    }
});


app.put('/data/persist/:entityName', function(req, res) {
    if (isAdminRequest(req)) {
        console.log("[PUT /data/persist]");
        let entityName = req.params.entityName;
        let url = persist_server_url + PERSIST_SERVER_MGMNT_ENDPOINT_GET + entityName;
        console.log("JSON.stringify(req.body): " + JSON.stringify(req.body));
        let r = request.put({uri: url, json: req.body});
        console.log("JSON.stringify(r): " + JSON.stringify(r));
        req.pipe(r).pipe(res);
    }
    else {
        res.end("Unauthorized request. Only the admin user can use /data/ management endpoint.")
    }
});

// HTTP request's body parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routers
const routes = require('./routes');
app.use('/api', routes);

function isRegistered(username) {
    // let users_table = JSON.parse(getTable(USERS_TABLE_NAME));
    let users_table = persistApi.getTable(USERS_TABLE_NAME);
    if (users_table) {
        if (users_table.hasOwnProperty(username)) {
            return true;
        }
    }
    return false;
}

function verifyLogin(username, passwd) {
    let users_table = persistApi.getTable(USERS_TABLE_NAME);
    if (users_table.hasOwnProperty(username)) {
        if (users_table[username]['pass'] === passwd) {
            return true;
        }
    }
    return false;
}

function registerUser(username, passwd, full_name) {
    if (username !== undefined) {
        let record = {
            "pass": passwd,
            "vip": {
                "full name": full_name, "id": "", "phone": "", "address": "", "birthday": "", "email": ""
            }
        };
        let table = persistApi.getTable(USERS_TABLE_NAME);
        if (!isRegistered(username)) {
            table[username] = record;
            let status = persistApi.setTable(USERS_TABLE_NAME, table);
            if (status === 0) {
                return 0;
            }
        }
        else {
            return 1;
        }
    }
}

// User management API
app.post("/users/register",function(req,res){
    if (req.body.name &&
        req.body.user &&
        req.body.pass) {
        let username = req.body.user;
        let passwd = req.body.pass;
        let full_name = req.body.name;
        let statusCode = registerUser(username, passwd, full_name);
        if (statusCode === 0) {
            res.cookie('user', username, {maxAge: (1000 * 60 * 30), httpOnly: false, secure: false});
            res.end("0");
        }
        else {
            res.end("1");
        }
    }
});

app.post("/users/login", (req, res) => {
    if (req.body.user &&
        req.body.pass) {
        let user = req.body.user;
        let pass = req.body.pass;
        let is_registered = verifyLogin(user, pass);
        if (is_registered) {
            res.cookie('user', user, {maxAge: (1000 * 60 * 30), httpOnly: false, secure: false});
            res.status(300).end('0');
        }
    }
    res.end('1')
});

// Verify cookie
function isAuthorizedRequest(req) {
    let is_authorized = false;
    let user = req.cookies.user;
    if (user !== undefined) {
        let user_record = getUserRecord(user);
        if (user_record) {
            is_authorized = true;
        }
    }
    return is_authorized;
}

function verifyAuthorizedUserAndResendCookie(req, res, next) {
    // Verify user's cookie
    let is_authorized = isAuthorizedRequest(req);
    if (is_authorized === true) {
        // Reset cookie's TTL
        res.cookie('user', req.cookies.user, {maxAge: (1000 * 60 * 30), httpOnly: false, secure: false});
        next()
    } else {
        res.redirect('/static/login.html');
    }
}

app.use((req, res, next) => {
    verifyAuthorizedUserAndResendCookie(req, res, next);
});


// Route all static files
app.use('/static/', express.static(static_path));


// Set index.html as root file
app.get("/",function(req,res){
    res.sendFile(path.join(static_path, '/index.html'));
});


app.get('/img/:filename', function(req, res) {
    let filename = req.params.filename;
    let url = persist_server_url + PERSIST_SERVER_IMGS + filename;
    let r = request(url);
    req.pipe(r).pipe(res);
});


// Ideas CRUD API
function getUserRecord(username) {
    if (username !== undefined) {
        let users_table = persistApi.getTable(USERS_TABLE_NAME);
        return users_table[username];
    }
    return undefined;
}


// 404 Error
app.use("*",function(req,res){
    res.sendFile(static_path + "404.html");
});


// Init server
app.listen(PORT ,function(){
    console.log("Live at Port " + PORT);
});
