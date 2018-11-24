const persistApi = require('../persistApi');
const ORDERS_TABLE_NAME = 'Orders';

function _getOrder(username) {
    let table = persistApi.getTable(ORDERS_TABLE_NAME);
    let order = table[username];
    return order === undefined ? {} : order;
}

module.exports = {
    getOrder: function (req, res) {
        // let username = req.params.username;
        let username = req.cookies.user;
        let order = _getOrder(username);
        res.end(JSON.stringify(order));
    },

    addProduct: function (req, res) {
        // let username = req.params.username;
        let username = req.cookies.user;
        let currentOrder = _getOrder(username);
        let additionalOrder = req.body;
        let mergedOrder = Object.assign(currentOrder, additionalOrder);
        let table = persistApi.getTable(ORDERS_TABLE_NAME);
        table[username] = mergedOrder;
        let status = persistApi.setTable(ORDERS_TABLE_NAME, table);
        if (status === 0) {
            res.end('0');
        }
        res.end('1');
    },

    setOrder : function (req, res) {
        let username = req.cookies.user;
        let table = persistApi.getTable(ORDERS_TABLE_NAME);
        table[username] = req.body;
        let status = persistApi.setTable(ORDERS_TABLE_NAME, table);
        if (status === 0) {
            res.end('0');
        }
        res.end('1');
    }
};
