// Persist Server
const PERSIST_SERVER_ADDR = 'localhost';
const PERSIST_SERVER_PORT = 4000;
const persist_server_url = "http://" + PERSIST_SERVER_ADDR + ":" + PERSIST_SERVER_PORT + '/data/persist/';

const sync_request = require('sync-request');
exports.getTable = function (table_name) {
    if (table_name !== undefined) {
        // let url = persist_server_url + "/getTable/" + table_name;
        let url = persist_server_url + table_name;
        let res = sync_request('GET', url, { json: true });
        let resBody = res.getBody('utf8');
        return JSON.parse(resBody);
    }
};

exports.setTable = function (table_name, value) {
    if (table_name !== undefined) {
        // let url = persist_server_url + "/setTable/" + table_name;
        let url = persist_server_url + table_name;
        let res = sync_request('PUT', url, { json: value });
        return 0;
    }
    return 1;
};