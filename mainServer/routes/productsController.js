const persistApi = require('../persistApi');
const PRODUCTS_TABLE_NAME = 'Products';

module.exports = {
    getPrice: function (req, res) {
        const PRICE_KEY_NAME = 'price';
        let productName = req.params.productName;
        let table = persistApi.getTable(PRODUCTS_TABLE_NAME);
        // let product = table[productName];
        let price = undefined;
        if (productName) {
            price = table[productName][PRICE_KEY_NAME];
        }
        res.end(price === undefined ? '-1' : price.toString());
    },

    getStock: function (req, res) {
        const STOCK_KEY_NAME = 'stock';
        let productName = req.params.productName;
        let table = persistApi.getTable(PRODUCTS_TABLE_NAME);
        let product = table[productName];
        let stock = undefined;
        if (productName) {
            stock = table[productName][STOCK_KEY_NAME];
        }
        // console.log(stock);
        // console.log(table);
        // console.log(productName);
        res.end(stock === undefined ? '-1' : stock.toString());
        // res.end(stock);
    },

    getSale: function (req, res) {
        const SALE_KEY_NAME = 'sale';
        // let productName = req.params.productName;
        let table = persistApi.getTable(PRODUCTS_TABLE_NAME);
        // let product = table[productName];
        let productsInSale = [];
        for (let productName in table) {
            console.log("productName: " + productName);
            let isInSale = table[productName]['sale'];
            console.log("isInSale: " + isInSale);
            if (isInSale === true) {
                productsInSale.push(productName);
            }
        }
        // let result = table.filter(productsInSale);

        let filtered = Object.keys(table)
            .filter(key => productsInSale.includes(key))
            .reduce((obj, key) => {
                obj[key] = table[key];
                return obj;
            }, {});
        // let filteredTable = table.filter();
        // let sale = undefined;
        // if (productName) {
        //     sale = productName[SALE_KEY_NAME].toString();
        // }

        // res.end(JSON.stringify(productsInSale));
        res.end(JSON.stringify(filtered));
    },

    getVegan: function (req, res) {
        const VEGAN_KEY_NAME = 'vegan';
        let productName = req.params.productName;
        let table = persistApi.getTable(PRODUCTS_TABLE_NAME);
        let product = table[productName];
        let vegan = undefined;
        if (productName) {
            vegan = productName[VEGAN_KEY_NAME].toString();
        }

        res.end(vegan);
    },

    getKosher: function (req, res) {
        const KOSHER_KEY_NAME = 'kosher';
        let productName = req.params.productName;
        let table = persistApi.getTable(PRODUCTS_TABLE_NAME);
        let product = table[productName];
        let kosher = undefined;
        if (productName) {
            kosher = productName[KOSHER_KEY_NAME].toString();
        }

        res.end(kosher);
    },

    getDepartment: function (req, res) {
        const DEPARTMENT_KEY_NAME = 'department';
        let productName = req.params.productName;
        let table = persistApi.getTable(PRODUCTS_TABLE_NAME);
        let product = table[productName];
        let department = undefined;
        if (productName) {
            department = productName[DEPARTMENT_KEY_NAME].toString();
        }

        res.end(department);
    },

    getProducts: function (req, res) {
        let table = persistApi.getTable(PRODUCTS_TABLE_NAME);
        res.end(JSON.stringify(table));
    }
};


