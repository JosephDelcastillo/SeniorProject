const { Users } = require('../lib/DBConnection');

// Test
async function Test (data) {
    return new Promise(async resolve => {
        const query = "SELECT u.id, u.name FROM u"
        const result = Users.items.query(query).fetchAll();
        resolve (result);
        return result;
    });
}

module.exports = {
    Test
}