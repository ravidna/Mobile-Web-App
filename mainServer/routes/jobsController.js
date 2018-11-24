const persistApi = require('../persistApi');
const ORDERS_TABLE_NAME = 'Jobs';

module.exports = {
    getJobs: function (req, res) {
        let table = persistApi.getTable(ORDERS_TABLE_NAME);
        res.end(JSON.stringify(table));
    }
};
