
const persistApi = require('../persistApi');
const USERS_TABLE_NAME = 'Users';


function hasValue(variable) {
    if (typeof variable !== 'undefined') {
        if (variable !== null) {
            return true;
        }
    }
    return false;
}

function hasEmpty(list) {
    let checkRes = list.map(hasValue);
    return checkRes.indexOf(false) > -1;
}

module.exports = {
    vipRegister: function (req, res) {
        let VIP_KEY_NAME = 'vip';
        let username = req.cookies.user;
        let fullName = req.body.fullName;
        let id = req.body.id;
        let phone = req.body.phone;
        let addr = req.body.addr;
        let birthday = req.body.birthday;
        let email = req.body.email;
        // if (username && fullName && id &&
        // phone && addr && birthday && email) {
        let allVariables = [username, fullName, id, phone, addr, birthday, email];
        if (!hasEmpty(allVariables)) {
            let vip_record = {"full name": fullName, "id": id,"phone": phone, "address":addr,
                "birthday": birthday, "email":email};
            let table = persistApi.getTable(USERS_TABLE_NAME);
            if (table[username]) {
                table[username][VIP_KEY_NAME] = vip_record;
                let status = persistApi.setTable(USERS_TABLE_NAME, table);
                if (status === 0) {
                    res.end('0');
                }
            }
        }
        res.end('1');
    }
};