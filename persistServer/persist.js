// Prevent stack trace to be sent
process.env.NODE_ENV = 'production';

// Globals
const PORT = 4000; // TODO: Use 80
const STATIC_DIR_NAME = '/static/';
const PERSIST_DIR_NAME = '/scratch/';

const STATIC_IMGS_DIR_NAME = STATIC_DIR_NAME + 'imgs/';
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
// const static_path = path.join(__dirname, STATIC_DIR_NAME);
const static_imgs_path = path.join(__dirname, STATIC_IMGS_DIR_NAME);


// HTTP request's body parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set local storage
if (typeof localStorage === "undefined" || localStorage === null) {
    let LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./' + PERSIST_DIR_NAME);
}

function getTable(tableName) {
    if (tableName !== undefined) {
        let table = localStorage.getItem(tableName);
        return JSON.parse(table);
    }
    return undefined;
}

function setTable(table_name, value) {
    if (table_name !== undefined) {
        console.log("[persist.js setTable] value: " + value);
        localStorage.setItem(table_name, JSON.stringify(value));
        return 0;
    }
    return 1;
}

setTable('Products',
    {
        // Not On Sale
        'Milk': {'price': 5.99, 'stock': 30, 'sale': false, 'vegan': false, 'kosher': true, 'department':'dairy'},
        'Honey': {'price': 32.00, 'stock': 10, 'sale': false, 'vegan': true, 'kosher': true, 'department':'sweets'},
        'Eggs': {'price': 23.00, 'stock': 12, 'sale': false, 'vegan': false, 'kosher': true, 'department':'basics'},
        'Parsley': {'price': 4.30, 'stock': 7, 'sale': false, 'vegan': true, 'kosher': true, 'department':'vegetables'},
        'Pepper': {'price': 8.99, 'stock': 8, 'sale': false, 'vegan': true, 'kosher': true, 'department':'vegetables'},
        'Mushrooms': {'price': 7.99, 'stock': 11, 'sale': false, 'vegan': true, 'kosher': true, 'department':'vegetables'},
        'Broccoli': {'price': 8.00, 'stock': 20, 'sale': false, 'vegan': true, 'kosher': true, 'department':'vegetables'},
        'Spinach': {'price': 7.00, 'stock': 15, 'sale': false, 'vegan': true, 'kosher': true, 'department':'vegetables'},
        'Tariaki sauce': {'price': 25.00, 'stock': 10, 'sale': false, 'vegan': true, 'kosher': true, 'department':'cooking supplies'},
        // On Sale
        'Tomato': {'price': 2.99, 'stock': 55, 'sale': true, 'vegan': true, 'kosher': true, 'department':'vegetables'},
        'Onion': {'price': 5.50, 'stock': 80, 'sale': true, 'vegan': true, 'kosher': true, 'department':'vegetables'},
        'Lemon': {'price': 4.99, 'stock': 45, 'sale': true, 'vegan': true, 'kosher': true, 'department':'fruits'},
        'Cheese': {'price': 5.99, 'stock': 12, 'sale': true, 'vegan': false, 'kosher': true, 'department':'dairy'},
        'Bread': {'price': 9.99, 'stock': 9, 'sale': true, 'vegan': true, 'kosher': true, 'department':'bakery'},
        'Beef': {'price': 23.99, 'stock': 35, 'sale': true, 'vegan': false, 'kosher': true, 'department':'butcher'},
        'Chicken': {'price': 25.99, 'stock': 25, 'sale': true, 'vegan': false, 'kosher': true, 'department':'butcher'}
    });

setTable('Jobs',
    [
        {"title": "Manager of the Department of Stewardship",
            "description":"work hours: Work shifts A - and / or Saturday night at the opening hours of the branch (08: 00-23: 00) 8-10 hours shift. There is an option for extra hours",
            "date": "31/07/2018"
        },
        {"title": "Cashier",
            "description":"work hours: Work shifts A - and / or Saturday night at the opening hours of the branch (08: 00-23: 00) 6-8 hours shift. There is an option for extra hours",
            "date":"01/08/2018"}
    ]);

app.get("/img/:filename", (req, res) => {
    let imgPath = path.join(static_imgs_path, String(req.params.filename));
    console.log("img path : " + imgPath);
    res.sendFile(imgPath);
});

// DB API
app.get('/data/persist/:table_name', (req, res) => {
    let tableName = req.params.table_name;
    // console.log("getTable with tableName: " + tableName);
    let table_body = getTable(tableName);
    console.log("JSON.stringify(table_body): " + JSON.stringify(table_body));
    // res.end(table_body);
    res.end(JSON.stringify(table_body));
});

app.put('/data/persist/:table_name', (req, res) => {
    let tableName = req.params.table_name;
    let new_table = req.body;
    let status = setTable(tableName, new_table);
    if (status === 0) {
        return res.end("0");
    }
    return res.end("1");
});

app.get('/data/clean/:table_name', (req, res) => {
    let tableName = req.params.table_name;
    console.log("Cleaning table: " + tableName);
    let status = setTable(tableName, {});
    if (status === 0) {
        return res.end("0");
    }
    return res.end("1");
});


// 404 Error
app.use("*",function(req,res){
    res.end("not found");
    // res.sendFile(static_path + "404.html");
});


// Init server
app.listen(PORT ,function(){
    console.log("Live at Port " + PORT);
});
